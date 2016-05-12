'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Problems Permissions
 */
exports.invokeRolesPolicies = function () {
    acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/problems',
            permissions: '*'
        }, {
            resources: '/api/problems/:problemId',
            permissions: '*'
        }, {
            resources: '/api/submissions/:problemId',
            permissions: '*'
        }, {
            resources: '/api/submissions/details/:submissionId',
            permissions: '*'
        },{
            resources: '/api/submissions',
            permissions: '*'
        }]
    }, {
        roles: ['user'],
        allows: [{
            resources: '/api/problems',
            permissions: ['get', 'post']
        }, {
            resources: '/api/problems/:problemId',
            permissions: ['get']
        }, {
            resources: '/api/submissions/:problemId',
            permissions: '*'
        }, {
            resources: '/api/submissions/details/:submissionId',
            permissions: '*'
        },{
            resources: '/api/submissions',
            permissions: '*'
        }]
    }, {
        roles: ['guest'],
        allows: [{
            resources: '/api/problems',
            permissions: ['get']
        }, {
            resources: '/api/problems/:problemId',
            permissions: ['get']
        }, {
            resources: '/api/submissions/:problemId',
            permissions: ['get']
        },{
            resources: '/api/submissions',
            permissions: '*'
        }]
    }]);
};

/**
 * Check If problems Policy Allows
 */
exports.isAllowed = function (req, res, next) {
    var roles = (req.user) ? req.user.roles : ['guest'];

    // If an problem is being processed and the current user created it then allow any manipulation
    if (req.problem && req.user && req.problem.user && req.problem.user.id === req.user.id) {
        return next();
    }

    // Check for user roles
    acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
        if (err) {
            // An authorization error occurred
            return res.status(500).send('Unexpected authorization error');
        } else {
            if (isAllowed) {
                // Access granted! Invoke next middleware
                return next();
            } else {
                return res.status(403).json({
                    message: 'User is not authorized'
                });
            }
        }
    });
};
