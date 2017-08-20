export default {
    signup: [
        { label: 'Username', name: 'username', type: 'text', message: 'You must enter a valid username' },
        { label: 'Email', name: 'email', type: 'email', message: 'You must enter a valid email address'},
        { label: 'Password', name: 'password', type: 'password', message: 'You must enter a valid password with at least 8 characters' },
        { label: 'Confirm Password', name: 'confirm_password', type: 'password', message: 'Passwords must match' },
        { label: 'I agree to the', name: 'agreement', type: 'checkbox', message: 'You must agree to the terms of service'}
    ],
    login: [
        { label: 'Username', name: 'username', type: 'text', message: 'You must enter a valid username' },
        { label: 'Password', name: 'password', type: 'password', message: 'You must enter a valid password'}  
    ]
};