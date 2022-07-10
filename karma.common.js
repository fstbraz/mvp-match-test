module.exports = {
  coverageDir: "coverage",
  libsKarmaConfig: (baseConfig) => {
    return {
      ...baseConfig,
      coverageReporter: {
        ...baseConfig.coverageReporter,
        dir: baseConfig.coverageReporter.dir,
        reporters: [
          ...baseConfig.coverageReporter.reporters,
          {
            type: "lcovonly",
            dir: baseConfig.coverageReporter.dir,
            file: `lcov.info`,
          },
        ],
      },
    };
  },
};
