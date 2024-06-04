// Check if user is signed in, or admin
// for routes like user.deleteUser or user.editUser

function isAuthorized(req, res, next) {
    // Is the client the user? Or an Author(admin)?
    if (req.user.id === req.params.userId || req.user.membership === 'Author') {
        // yes, proceed to next middleware
        return next();
    } else {
        // no, stop right there!
        return res.status(403).send('Unauthorized access.');
    }
}

module.exports = isAuthorized;
