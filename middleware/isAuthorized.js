// Check if user is signed in, or admin
// for routes like user.deleteUser or user.editUser

function isAuthorized(req, res, next) {
    const paramsId = parseInt(req.params.userId);
    const userId = parseInt(req.user.id);
    console.log('Hit isAuthorized with: ', req.params.userId, req.user.id);
    console.log('Matching user ID', paramsId, userId);
    // Is the client the user? Or an Author(admin)?
    if (userId === paramsId || req.user.membership === 'Author') {
        // yes, proceed to next middleware
        return next();
    } else {
        // no, stop right there!
        const err = new Error('Unauthorized access.');
        err.status = 401;
        return next(err);
    }
}

module.exports = isAuthorized;
