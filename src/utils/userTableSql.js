const postSql = {
    sqlTimeoutUser:
        "UPDATE",
    sqlPromoteUser:
        "UPDATE..",
    sqlReviewReport:
        "SELECT..",
    sqlSendWarning:
        "UPDATE WARNINGS..",
    sqlDeletePost: "DELETE FROM Posts WHERE id = ?"
}

module.exports = postSql;
