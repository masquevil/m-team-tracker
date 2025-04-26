module.exports = {
  apps: [
    {
      name: "mt",
      script: "yarn",
      args: "start",
      interpreter: "none",
      out_file: "logs/out.log",
      error_file: "logs/err.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm Z",
    },
  ],
};
