(function(){
// This interceptor will run on all HTTP requests and handle our JWT tokens
function authInterceptor(API, auth) {
    return {
        // automatically attach Authorization header
        request: function(config) {
            var token = auth.getToken();
            if(config.url.indexOf(API) === 0 && token) {
                config.headers.Authorization = 'JWT ' + token;
            } 

            return config;
        },

        // If a token was sent back, save it
        response: function(res) {
            if(res.config.url.indexOf(API) === 0 && res.data.token) {
                auth.saveToken(res.data.token);
            }

            return res;
        },

        // If we errored, handle that too
        responseError: function(res) {
            // On a 401 error, redirect back to the login page
            if(res.status === 401) {
                window.location = "/login";
            }
        }
    }
}

// This service will help us hold onto our authentication token
function authService($window) {
    var self = this;

    // Probably don't need this function.  We aren't going to use the token on the front end.
    self.parseJwt = function(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
    }

    // Save the token into local storage (TODO: Or cookie if unavailable)
    self.saveToken = function(token) {
        $window.localStorage['jwtToken'] = token;
    }

    // Get the token out of local storage
    self.getToken = function() {
        return $window.localStorage['jwtToken'];
    }
}

// This service handles the calls to our API for login and registration
function userService($http, API, auth) {
    var self = this;

    // TODO: Remove this function
    self.getQuote = function() {
        return $http.get(API + '/leagues')
    };

    // Call the API to Register the user
    self.register = function(email, username, password) {
        return $http.post(API + '/auth/register', {
            'email': email,
            'username': username,
            'password': password,
        })
    };

    // Call the API to login
    self.login = function(username, password) {
        return $http.post(API + '/auth/login', {
            username: username,
            password: password
        })
    };

    // Check if the user is signed in
    //  TODO: Move this to the authService
    self.isAuthed = function() {
        var token = self.getToken();

        if(token) {
            return true;
        } else {
            return false;
        }
    };

    // Remove the token to log the user out
    self.logout = function() {
        $window.localStorage.removeItem('jwtToken');
    };
}

// Controller for the login page
function LoginCtrl(user, auth) {
    var self = this;

    function handleRequest(res) {
        var token = res.data ? res.data.token : null;
        if(token) { console.log('JWT:', token); }
        self.message = res.data.message;
    }

    self.login = function() {
        user.login(self.username, self.password)
            .then(handleRequest, handleRequest)
    }

    self.register = function() {
        if(self.password != self.confirmPassword) {
            self.signupmessage = "Your passwords do not match";
            return false;
        }
        
        user.register(self.email, self.username, self.password, self.confirm_password)
            .then(handleRequest, handleRequest)
    }

    self.getQuote = function() {
        user.getQuote()
            .then(handleRequest, handleRequest)
    }

    self.logout = function() {
        auth.logout && auth.logout()
    }

    self.isAuthed = function() {
        return auth.isAuthed ? auth.isAuthed() : false
    }
}

angular.module('StrayLogin', [])
.factory('authInterceptor', authInterceptor)
.service('user', userService)
.service('auth', authService)
.constant('API', 'https://api.strayadmin.com')
.config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
})
.controller('Login', LoginCtrl)
})();