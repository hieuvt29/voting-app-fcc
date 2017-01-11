module.exports = {
	'facebookAuth': {
		'clientID': process.env.FACEBOOK_ID,
		'clientSecret': process.env.FACEBOOK_SECRET,
		'callbackURL': process.env.APP_URL + 'auth/facebook/callback'
	}
};
