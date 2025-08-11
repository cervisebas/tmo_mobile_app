const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withKeepNotificationIcon(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const keepFilePath = path.join(
        config.modRequest.projectRoot,
        "android",
        "app",
        "src",
        "main",
        "res",
        "values",
        "tmo.keep.xml"
      );

      fs.mkdirSync(path.dirname(keepFilePath), { recursive: true });

      const xmlContent = `
        <?xml version="1.0" encoding="utf-8"?>
        <resources xmlns:tools="http://schemas.android.com/tools" tools:keep="@drawable/ic_notification" />
      `.trim();

     fs.writeFileSync(keepFilePath, xmlContent);
     return config;
    },
  ]);
};
