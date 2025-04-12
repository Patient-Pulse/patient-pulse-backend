const mapDbError = (err) => {
    console.log(err);
    console.log('error')
    const errorMap = {
        ER_DUP_ENTRY: { status: 409, message: "Duplicate entry found. Use a unique value." },
        ER_BAD_FIELD_ERROR: { status: 400, message: "Invalid field in query. Check your input." },
        ER_NO_SUCH_TABLE: { status: 500, message: "Database table not found. Contact support." },
        ER_BAD_NULL_ERROR: { status: 400, message: "Missing required field. Please fill in all required details." },
        ER_PARSE_ERROR: { status: 500, message: "Database query syntax error. Contact support." },
        ER_CON_COUNT_ERROR: { status: 503, message: "Too many connections. Try again later." },
        ER_ACCESS_DENIED_ERROR: { status: 403, message: "Access denied. Check your credentials." },
        ER_LOCK_DEADLOCK: { status: 409, message: "Deadlock detected. Retry the operation." },
        ER_QUERY_INTERRUPTED: { status: 500, message: "Query interrupted. Retry the operation." },
        ER_DATA_TOO_LONG: { status: 400, message: "Data too long for column." },
        ER_ROW_IS_REFERENCED_2: { status: 409, message: "Cannot delete or update: Foreign key constraint fails." },
        ER_NO_REFERENCED_ROW_2: { status: 400, message: "Foreign key constraint fails: Invalid reference." },
        VALIDATION_ERROR: { status: 422, message: err.message ? err.message : "Validation error. Check your input." },

    };

    return errorMap[err.code] || { status: 500, message: "An internal server error occurred." };
};

export default mapDbError;
