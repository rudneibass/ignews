module.exports = {
	testPathIgnorePatterns: ["/node_modules/", "/.next/"],
	setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.js"],
	transform: { "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"},
	testEnvironment: "jest-environment-jsdom",
	moduleNameMapper: { "\\.(scss|css|asaa)$" : "identity-obj-proxy"},
	collectCoverage: true,
	collectCoverageFrom: [
		"src/**/*.tsx",
		"!src/**/*spec.tsx",
	],
	coverageReporters: ["lcov", "json"]
};