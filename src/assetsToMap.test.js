const AssetsToMap = require("./assetsToMap");
const fs = require("fs");

function cleanResultFiles() {
  const files = "./src/mock/result/final";

  fs.unlink(files + ".json", err => {
    if (err) {
    }
  });
  fs.unlink(files + ".yaml", err => {
    if (err) {
    }
  });
  fs.unlink(files + ".toml", err => {
    if (err) {
    }
  });
}

function cleanSourceFilesMock() {
  fs.unlink("./src/mock/mock.js", err => {
    if (err) {
    }
  });
  fs.unlink("./src/mock/mock2.css", err => {
    if (err) {
    }
  });
}

function cpSourceFilesMock() {
  fs.copyFileSync(
    "./src/mock/sourceFiles/mock.js",
    "./src/mock/mock.js",
    err => {
      if (err) throw err;
    }
  );
  fs.copyFileSync(
    "./src/mock/sourceFiles/mock2.css",
    "./src/mock/mock2.css",
    err => {
      if (err) throw err;
    }
  );
}

describe("AssetsToMap", () => {
  beforeEach(async (done) => {
    await cpSourceFilesMock();
    done();
  });

  afterEach(async (done) => {
    await cleanResultFiles();
    await cleanSourceFilesMock();

    done();
  });

  test("hello world", () => {
    const compiler = {};
    compiler.plugin = jest.fn();
    AssetsToMap.prototype.apply(compiler);
    expect(compiler.plugin).toHaveBeenCalled();
  });

  test("writeFiles no files provided", () => {
    // with
    const plugin = new AssetsToMap();

    // when
    const result = plugin.writeFile();

    // then
    expect(result).toBeFalsy();
  });

  test("writeFiles files is not an object", () => {
    // with
    const config = {
      files: ["test.js", "test2.css"],
    };
    const plugin = new AssetsToMap();

    // when
    let result = plugin.writeFile(config);

    // then
    expect(result).toBeFalsy();
  });

  test("writeFiles sourcePath and outputPath should be okay with a trailing slash", () => {
    // with
    const config = {
      files: {
        success: "mock.js",
        style: "mock2.css",
      },
      filename: "final",
      sourcePath: "./src/mock/",
      outputPath: "./src/mock/result/",
    };
    const plugin = new AssetsToMap(config);

    // when
    let result = plugin.writeFile();

    let data = fs.readFileSync("./src/mock/result/final.json").toString();

    // then
    expect(result).toBeTruthy();
    expect(data).toMatchSnapshot();
  });

  test("writeFiles sourcePath and outputPath should be okay without a trailing slash", () => {
    // with
    const config = {
      files: {
        success: "mock.js",
        style: "mock2.css",
      },
      filename: "final",
      sourcePath: "./src/mock",
      outputPath: "./src/mock/result",
    };
    const plugin = new AssetsToMap(config);

    // when
    let result = plugin.writeFile();

    let data = fs.readFileSync("./src/mock/result/final.json").toString();

    // then
    expect(result).toBeTruthy();
    expect(data).toMatchSnapshot();
  });

  describe("single file provided", () => {
    test("writeFiles format set to default", () => {
      // with
      const config = {
        files: {
          success: "./src/mock/mock.js",
        },
        filename: "final",
        outputPath: "./src/mock/result",
      };
      const plugin = new AssetsToMap(config);

      // when
      let result = plugin.writeFile();

      let data = fs.readFileSync("./src/mock/result/final.json").toString();

      // then
      expect(result).toBeTruthy();
      expect(data).toMatchSnapshot();
    });

    test("writeFiles format set to json", () => {
      // with
      const config = {
        files: {
          success: "./src/mock/mock.js",
        },
        filename: "final",
        outputPath: "./src/mock/result",
        format: "json",
      };
      const plugin = new AssetsToMap(config);

      // when
      let result = plugin.writeFile();

      let data = fs.readFileSync("./src/mock/result/final.json").toString();

      // then
      expect(result).toBeTruthy();
      expect(data).toMatchSnapshot();
    });

    test("writeFiles format set to yaml", () => {
      // with
      const config = {
        files: {
          success: "./src/mock/mock.js",
        },
        filename: "final",
        outputPath: "./src/mock/result",
        format: "yaml",
      };
      const plugin = new AssetsToMap(config);

      // when
      let result = plugin.writeFile();

      let data = fs.readFileSync("./src/mock/result/final.yaml").toString();

      // then
      expect(result).toBeTruthy();
      expect(data).toMatchSnapshot();
    });

    test("writeFiles format set to toml", () => {
      // with
      const config = {
        files: {
          success: "./src/mock/mock.js",
        },
        filename: "final",
        outputPath: "./src/mock/result",
        format: "toml",
      };
      const plugin = new AssetsToMap(config);

      // when
      let result = plugin.writeFile();

      let data = fs.readFileSync("./src/mock/result/final.toml").toString();

      // then
      expect(result).toBeTruthy();
      expect(data).toMatchSnapshot();
    });
  });

  describe("multiple files provided", () => {
    test("writeFiles format set to default", () => {
      // with
      const config = {
        files: {
          success: "./src/mock/mock.js",
          style: "./src/mock/mock2.css",
        },
        outputPath: "./src/mock/result",
        filename: "final",
      };
      const plugin = new AssetsToMap(config);

      // when
      let result = plugin.writeFile();

      let data = fs.readFileSync("./src/mock/result/final.json").toString();

      // then
      expect(result).toBeTruthy();
      expect(data).toMatchSnapshot();
    });

    test("writeFiles format set to json", () => {
      // with
      const config = {
        files: {
          success: "./src/mock/mock.js",
          style: "./src/mock/mock2.css",
        },
        filename: "final",
        outputPath: "./src/mock/result",
        format: "json",
      };
      const plugin = new AssetsToMap(config);

      // when
      let result = plugin.writeFile();

      let data = fs.readFileSync("./src/mock/result/final.json").toString();

      // then
      expect(result).toBeTruthy();
      expect(data).toMatchSnapshot();
    });

    test("writeFiles format set to yaml", () => {
      // with
      const config = {
        files: {
          success: "./src/mock/mock.js",
          style: "./src/mock/mock2.css",
        },
        filename: "final",
        outputPath: "./src/mock/result",
        format: "yaml",
      };
      const plugin = new AssetsToMap(config);

      // when
      let result = plugin.writeFile();

      let data = fs.readFileSync("./src/mock/result/final.yaml").toString();

      // then
      expect(result).toBeTruthy();
      expect(data).toMatchSnapshot();
    });

    test("writeFiles format set to toml", () => {
      // with
      const config = {
        files: {
          success: "./src/mock/mock.js",
          style: "./src/mock/mock2.css",
        },
        filename: "final",
        outputPath: "./src/mock/result",
        format: "toml",
      };
      const plugin = new AssetsToMap(config);

      // when
      let result = plugin.writeFile();

      let data = fs.readFileSync("./src/mock/result/final.toml").toString();

      // then
      expect(result).toBeTruthy();
      expect(data).toMatchSnapshot();
    });
  });

  describe("remove files inlined", () => {
    test("writeFiles format set to default", () => {
      // with
      const config = {
        files: {
          success: "./src/mock/mock.js",
          style: "./src/mock/mock2.css",
        },
        outputPath: "./src/mock/result",
        filename: "final",
        deleteFiles: true,
      };
      const plugin = new AssetsToMap(config);

      // when
      let result = plugin.writeFile();

      let data = fs.readFileSync("./src/mock/result/final.json").toString();

      // then
      expect(result).toBeTruthy();
      expect(data).toMatchSnapshot();
    });

    test("writeFiles format set to json", () => {
      // with
      const config = {
        files: {
          success: "./src/mock/mock.js",
          style: "./src/mock/mock2.css",
        },
        filename: "final",
        outputPath: "./src/mock/result",
        format: "json",
        deleteFiles: true,
      };
      const plugin = new AssetsToMap(config);

      // when
      let result = plugin.writeFile();

      let data = fs.readFileSync("./src/mock/result/final.json").toString();

      // then
      expect(result).toBeTruthy();
      expect(data).toMatchSnapshot();
    });

    test("writeFiles format set to yaml", () => {
      // with
      const config = {
        files: {
          success: "./src/mock/mock.js",
          style: "./src/mock/mock2.css",
        },
        filename: "final",
        outputPath: "./src/mock/result",
        format: "yaml",
        deleteFiles: true,
      };
      const plugin = new AssetsToMap(config);

      // when
      let result = plugin.writeFile();

      let data = fs.readFileSync("./src/mock/result/final.yaml").toString();

      // then
      expect(result).toBeTruthy();
      expect(data).toMatchSnapshot();
    });

    test("writeFiles format set to toml", () => {
      // with
      const config = {
        files: {
          success: "./src/mock/mock.js",
          style: "./src/mock/mock2.css",
        },
        filename: "final",
        outputPath: "./src/mock/result",
        format: "toml",
      };
      const plugin = new AssetsToMap(config);

      // when
      let result = plugin.writeFile();

      let data = fs.readFileSync("./src/mock/result/final.toml").toString();

      // then
      expect(result).toBeTruthy();
      expect(data).toMatchSnapshot();
    });
  });
});
