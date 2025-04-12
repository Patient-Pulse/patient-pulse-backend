import db from "../../../config/knex.js";
import { sendErrorResponse, sendSuccessResponse } from "../../../utils/respHandler.js";
import { visitAnalyticsSchema } from "../validator/analytics.validator.js";


export const getVisitAnalytics = async (req, res) => {
  try {
    // Validate query parameters
    const { error, value } = visitAnalyticsSchema.validate(req.query, {
      abortEarly: false,
    });

    if (error) {
      return sendErrorResponse(
        res,
        {
          code: "VALIDATION_ERROR",
          message: error.details.map((err) => err.message).join(", "),
        },
        process.env.NODE_ENV
      );
    }

    const { range = "7d", doctor_id } = value;
    const { user_id, user_role, clinic_id } = req;

    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();

    switch (range) {
      case "7d":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(endDate.getDate() - 90);
        break;
      case "180d":
        startDate.setDate(endDate.getDate() - 180);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    // Format dates for the database query
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    // Build base query
    let query = db("patient_visits")
      .select(db.raw("DATE(visit_date) as date"))
      .count("id as count")
      .where("clinic_id", clinic_id)
      .whereBetween(db.raw("DATE(visit_date)"), [
        formattedStartDate,
        formattedEndDate,
      ]);

    if (user_role === "doctor") {
      query = query.where("doctor_id", user_id);
    } else if (user_role === "admin" && doctor_id) {
      query = query.where("doctor_id", doctor_id);
    } else if (user_role !== "admin") {
      return sendErrorResponse(
        res,
        {
          code: "PERMISSION_DENIED",
          message: "You don't have permission to access visit analytics",
        },
        process.env.NODE_ENV
      );
    }

    query = query.groupBy("date").orderBy("date");

    const visitsData = await query;

    const formattedData = fillMissingDates(
      formattedStartDate,
      formattedEndDate,
      visitsData
    );

    return sendSuccessResponse(
      res,
      200,
      "Visit analytics retrieved successfully",
      formattedData
    );
  } catch (err) {
    console.error("Error in getVisitAnalytics:", err);
    return sendErrorResponse(res, err, process.env.NODE_ENV);
  }
};

/**
 * Helper function to fill in missing dates with zero visit counts
 */
const fillMissingDates = (startDateStr, endDateStr, data) => {
  const dateMap = {};

  // Convert data array to map with formatted date keys
  data.forEach((item) => {
    const dateStr = new Date(item.date).toISOString().split("T")[0];
    dateMap[dateStr] = parseInt(item.count);
  });

  const result = [];
  const currentDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];

    result.push({
      date: dateStr,
      count: dateMap[dateStr] || 0,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
};


export const getRevenueAnalytics = async (req, res) => {
  try {
    const { error, value } = visitAnalyticsSchema.validate(req.query, {
      abortEarly: false,
    });

    if (error) {
      return sendErrorResponse(
        res,
        {
          code: "VALIDATION_ERROR",
          message: error.details.map((err) => err.message).join(", "),
        },
        process.env.NODE_ENV
      );
    }

    const { range = '7d', doctor_id } = value;
    const { user_id, user_role, clinic_id } = req;

    const endDate = new Date();
    let startDate = new Date();

    switch (range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '180d':
        startDate.setDate(endDate.getDate() - 180);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7); // Default to 30 days
    }

    // Format dates for the database query
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    // Build base query to get daily revenue
    let query = db('patient_visits')
      .select(db.raw('DATE(visit_date) as date'))
      .sum('amount as amount')
      .where('clinic_id', clinic_id)
      .whereBetween(db.raw('DATE(visit_date)'), [formattedStartDate, formattedEndDate]);

    // Apply role-based filtering
    if (user_role === 'doctor') {
      // Doctors can only see their own revenue
      query = query.where('doctor_id', user_id);
    } else if (user_role === 'admin' && doctor_id) {
      // Admin can filter by specific doctor
      query = query.where('doctor_id', doctor_id);
    } else if (user_role !== 'admin') {
      // Non-admin, non-doctor roles should not access this endpoint
      return sendErrorResponse(
        res,
        {
          code: "PERMISSION_DENIED",
          message: "You don't have permission to access revenue analytics",
        },
        process.env.NODE_ENV
      );
    }

    // Group by date and order by date
    query = query.groupBy('date').orderBy('date');

    // Execute query
    const revenueData = await query;

    // Format data to fill in missing dates with zero revenue
    const formattedData = fillMissingDatesWithAmount(formattedStartDate, formattedEndDate, revenueData);

    return sendSuccessResponse(res, 200, "Revenue analytics retrieved successfully", formattedData);
  } catch (err) {
    console.error("Error in getRevenueAnalytics:", err);
    return sendErrorResponse(res, err, process.env.NODE_ENV);
  }
};

const fillMissingDatesWithAmount = (startDateStr, endDateStr, data) => {
  const dateMap = {};
  
  // Convert data array to map for O(1) lookups
  data.forEach(item => {
    const dateStr = new Date(item.date).toISOString().split("T")[0];
    dateMap[dateStr] = parseFloat(item.amount || 0);
  });
  
  const result = [];
  const currentDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  
  // Loop through each day in the range
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    result.push({
      date: dateStr,
      amount: dateMap[dateStr] || 0
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
};

// Corrected getDemographicsAnalytics function
export const getDemographicsAnalytics = async (req, res) => {
  try {
    const { doctor_id } = req.query;
    const { user_id, user_role, clinic_id } = req;

    // Check permissions
    if (user_role !== 'admin' && user_role !== 'doctor') {
      return sendErrorResponse(
        res,
        {
          code: "PERMISSION_DENIED",
          message: "You don't have permission to access demographic analytics",
        },
        process.env.NODE_ENV
      );
    }

    // Build base query for patients to filter by doctor if needed
    let basePatientQuery = db('patients').where('clinic_id', clinic_id);
    
    if (user_role === 'doctor' || (user_role === 'admin' && doctor_id)) {
      const filterDoctorId = user_role === 'doctor' ? user_id : doctor_id;
      
      // Get patients seen by this doctor
      const patientIds = await db('patient_visits')
        .select('patient_id')
        .where({
          doctor_id: filterDoctorId,
          clinic_id
        })
        .distinct();
      
      if (patientIds.length === 0) {
        // No patients for this doctor
        return sendSuccessResponse(res, 200, "Demographics retrieved successfully", {
          gender: [
            { name: 'Male', value: 0 },
            { name: 'Female', value: 0 },
            { name: 'Other', value: 0 }
          ],
          age: [
            { name: '0-17', value: 0 },
            { name: '18-30', value: 0 },
            { name: '31-45', value: 0 },
            { name: '46-60', value: 0 },
            { name: '61+', value: 0 }
          ]
        });
      }
      
      const ids = patientIds.map(p => p.patient_id);
      basePatientQuery = basePatientQuery.whereIn('id', ids);
    }

    // ----------------
    // GENDER ANALYTICS
    // ----------------
    // Build gender query
    const genderQuery = basePatientQuery.clone()
      .select('gender')
      .count('id as count')
      .whereNotNull('gender')
      .groupBy('gender');
    
    const genderResults = await genderQuery;
    
    // Format gender data
    const genderMap = {
      'male': 0,
      'female': 0,
      'other': 0
    };
    
    // Sum up counts by normalized gender categories
    genderResults.forEach(row => {
      const gender = (row.gender || '').toLowerCase();
      if (gender === 'male') {
        genderMap.male += parseInt(row.count);
      } else if (gender === 'female') {
        genderMap.female += parseInt(row.count);
      } else {
        genderMap.other += parseInt(row.count);
      }
    });
    
    // Create formatted gender data array
    const genderData = [
      { name: 'Male', value: genderMap.male },
      { name: 'Female', value: genderMap.female },
      { name: 'Other', value: genderMap.other }
    ];
    
    // ---------------
    // AGE ANALYTICS
    // ---------------
    // Calculate ages and group into categories
    const ageData = [
      { name: '0-17', value: 0 },
      { name: '18-30', value: 0 },
      { name: '31-45', value: 0 },
      { name: '46-60', value: 0 },
      { name: '61+', value: 0 }
    ];
    
    // Get all patients with date_of_birth
    const patientsWithDOB = await basePatientQuery.clone()
      .select('id', 'date_of_birth')
      .whereNotNull('date_of_birth');
    
    // Calculate age for each patient and increment appropriate bucket
    const today = new Date();
    patientsWithDOB.forEach(patient => {
      const birthDate = new Date(patient.date_of_birth);
      const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
      
      if (age < 18) {
        ageData[0].value++;
      } else if (age <= 30) {
        ageData[1].value++;
      } else if (age <= 45) {
        ageData[2].value++;
      } else if (age <= 60) {
        ageData[3].value++;
      } else {
        ageData[4].value++;
      }
    });
    
    // Return formatted demographics data
    return sendSuccessResponse(res, 200, "Demographics retrieved successfully", {
      gender: genderData,
      age: ageData
    });
  } catch (err) {
    console.error("Error in getDemographicsAnalytics:", err);
    return sendErrorResponse(res, err, process.env.NODE_ENV);
  }
};

export const getMedicationsAnalytics = async (req, res) => {
  try {
    const { doctor_id } = req.query;
    const { user_id, user_role, clinic_id } = req;

    // Check permissions
    if (user_role !== 'admin' && user_role !== 'doctor') {
      return sendErrorResponse(
        res,
        {
          code: "PERMISSION_DENIED",
          message: "You don't have permission to access medications analytics",
        },
        process.env.NODE_ENV
      );
    }

    // Build base medication query
    let query = db('prescribed_medicines as pm')
      .join('patient_visits as pv', 'pm.visit_id', 'pv.id')
      .select('pm.medicine_name')
      .count('pm.id as count')
      .where('pv.clinic_id', clinic_id)
      .groupBy('pm.medicine_name')
      .orderBy('count', 'desc')
      .limit(10);

    // Apply role-based filtering
    if (user_role === 'doctor') {
      // Doctors can only see their prescriptions
      query = query.where('pv.doctor_id', user_id);
    } else if (user_role === 'admin' && doctor_id) {
      // Admin can filter by specific doctor
      query = query.where('pv.doctor_id', doctor_id);
    }

    // Execute query
    const medications = await query;

    // Calculate total prescriptions for percentage calculation
    let totalPrescriptionsQuery = db('prescribed_medicines as pm')
      .join('patient_visits as pv', 'pm.visit_id', 'pv.id')
      .count('pm.id as total')
      .where('pv.clinic_id', clinic_id);

    // Apply the same role-based filtering
    if (user_role === 'doctor') {
      totalPrescriptionsQuery = totalPrescriptionsQuery.where('pv.doctor_id', user_id);
    } else if (user_role === 'admin' && doctor_id) {
      totalPrescriptionsQuery = totalPrescriptionsQuery.where('pv.doctor_id', doctor_id);
    }

    const totalResult = await totalPrescriptionsQuery;
    const totalPrescriptions = parseInt(totalResult[0].total) || 1; // Avoid division by zero

    // Format data with percentages
    const formattedData = medications.map(item => ({
      name: item.medicine_name,
      count: parseInt(item.count),
      percentage: Math.round((parseInt(item.count) / totalPrescriptions) * 100)
    }));

    return sendSuccessResponse(res, 200, "Medications analytics retrieved successfully", formattedData);
  } catch (err) {
    console.error("Error in getMedicationsAnalytics:", err);
    return sendErrorResponse(res, err, process.env.NODE_ENV);
  }
};

export const getDiagnosesAnalytics = async (req, res) => {
  try {
    const { doctor_id } = req.query;
    const { user_id, user_role, clinic_id } = req;

    // Check permissions
    if (user_role !== 'admin' && user_role !== 'doctor') {
      return sendErrorResponse(
        res,
        {
          code: "PERMISSION_DENIED",
          message: "You don't have permission to access diagnoses analytics",
        },
        process.env.NODE_ENV
      );
    }

    // Build base query for diagnoses
    let query = db('patient_visits')
      .select('diagnosis')
      .count('id as count')
      .where('clinic_id', clinic_id)
      .whereNotNull('diagnosis')
      .groupBy('diagnosis')
      .orderBy('count', 'desc')
      .limit(5); // Get top 10 diagnoses

    // Apply role-based filtering
    if (user_role === 'doctor') {
      // Doctors can only see their diagnoses
      query = query.where('doctor_id', user_id);
    } else if (user_role === 'admin' && doctor_id) {
      // Admin can filter by specific doctor
      query = query.where('doctor_id', doctor_id);
    }

    // Execute query
    const diagnoses = await query;

    // Calculate total visits with diagnoses for percentage
    let totalVisitsQuery = db('patient_visits')
      .count('id as total')
      .where('clinic_id', clinic_id)
      .whereNotNull('diagnosis');

    // Apply the same role-based filtering
    if (user_role === 'doctor') {
      totalVisitsQuery = totalVisitsQuery.where('doctor_id', user_id);
    } else if (user_role === 'admin' && doctor_id) {
      totalVisitsQuery = totalVisitsQuery.where('doctor_id', doctor_id);
    }

    const totalResult = await totalVisitsQuery;
    const totalVisits = parseInt(totalResult[0].total) || 1; // Avoid division by zero

    // Format data with percentages
    const formattedData = diagnoses.map(item => ({
      name: item.diagnosis,
      count: parseInt(item.count),
      percentage: Math.round((parseInt(item.count) / totalVisits) * 100)
    }));

    return sendSuccessResponse(res, 200, "Diagnoses analytics retrieved successfully", formattedData);
  } catch (err) {
    console.error("Error in getDiagnosesAnalytics:", err);
    return sendErrorResponse(res, err, process.env.NODE_ENV);
  }
};

// Corrected getConditionsAnalytics function
export const getConditionsAnalytics = async (req, res) => {
  try {
    const { doctor_id } = req.query;
    const { user_id, user_role, clinic_id } = req;

    // Check permissions
    if (user_role !== 'admin' && user_role !== 'doctor') {
      return sendErrorResponse(
        res,
        {
          code: "PERMISSION_DENIED",
          message: "You don't have permission to access conditions analytics",
        },
        process.env.NODE_ENV
      );
    }

    // Initialize an object to store condition counts
    const conditionCounts = {};
    let totalConditions = 0;
    
    // Build base query for patients
    let patientsQuery = db('patients')
      .select('id', 'chronic_conditions')
      .where('clinic_id', clinic_id)
      .whereNotNull('chronic_conditions')
      .whereRaw("chronic_conditions != ''"); // Ensure it's not an empty string
    
    // Apply role-based filtering
    if (user_role === 'doctor') {
      // For doctors, only show their patients
      const patientIds = await db('patient_visits')
        .distinct('patient_id')
        .where({
          doctor_id: user_id,
          clinic_id
        });
      
      const ids = patientIds.map(p => p.patient_id);
      
      if (ids.length === 0) {
        // No patients for this doctor
        return sendSuccessResponse(res, 200, "Conditions analytics retrieved successfully", []);
      }
      
      patientsQuery = patientsQuery.whereIn('id', ids);
    } else if (user_role === 'admin' && doctor_id) {
      // For admin filtering by a specific doctor
      const patientIds = await db('patient_visits')
        .distinct('patient_id')
        .where({
          doctor_id,
          clinic_id
        });
      
      const ids = patientIds.map(p => p.patient_id);
      
      if (ids.length === 0) {
        // No patients for this doctor
        return sendSuccessResponse(res, 200, "Conditions analytics retrieved successfully", []);
      }
      
      patientsQuery = patientsQuery.whereIn('id', ids);
    }
    
    // Get patients with chronic conditions
    const patients = await patientsQuery;
    
    // Process each patient's chronic conditions
    patients.forEach(patient => {
      if (patient.chronic_conditions) {
        // Split the conditions if they're stored as comma-separated values
        // Adjust this splitting logic based on how conditions are actually stored
        const conditions = patient.chronic_conditions.split(',').map(c => c.trim());
        
        // Count occurrences of each condition
        conditions.forEach(condition => {
          if (condition) {
            conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
            totalConditions++;
          }
        });
      }
    });
    
    // Convert to array and sort by count (descending)
    const sortedConditions = Object.entries(conditionCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalConditions) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Get top 10
    
    // If no chronic conditions found, fallback to diagnoses from visits
    if (sortedConditions.length === 0) {
      let diagnosesQuery = db('patient_visits')
        .select('diagnosis as name')
        .count('id as count')
        .where('clinic_id', clinic_id)
        .whereNotNull('diagnosis')
        .groupBy('diagnosis')
        .orderBy('count', 'desc')
        .limit(10);
      
      // Apply role-based filtering
      if (user_role === 'doctor') {
        diagnosesQuery = diagnosesQuery.where('doctor_id', user_id);
      } else if (user_role === 'admin' && doctor_id) {
        diagnosesQuery = diagnosesQuery.where('doctor_id', doctor_id);
      }
      
      const diagnoses = await diagnosesQuery;
      
      // Calculate total for percentages
      const totalDiagnoses = diagnoses.reduce((sum, item) => sum + parseInt(item.count), 0) || 1;
      
      // Format data
      const formattedData = diagnoses.map(item => ({
        name: item.name,
        count: parseInt(item.count),
        percentage: Math.round((parseInt(item.count) / totalDiagnoses) * 100)
      }));
      
      return sendSuccessResponse(
        res, 
        200, 
        "Conditions analytics retrieved successfully (using diagnoses)", 
        formattedData
      );
    }
    
    return sendSuccessResponse(res, 200, "Conditions analytics retrieved successfully", sortedConditions);
  } catch (err) {
    console.error("Error in getConditionsAnalytics:", err);
    return sendErrorResponse(res, err, process.env.NODE_ENV);
  }
};