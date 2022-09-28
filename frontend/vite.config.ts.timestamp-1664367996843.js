// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "file-system";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync("../keys-and-certificates/key-rsa.pem"),
      cert: fs.readFileSync("../keys-and-certificates/cert.pem")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQgZnMgZnJvbSAnZmlsZS1zeXN0ZW0nO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBodHRwczoge1xyXG4gICAgICBrZXk6IGZzLnJlYWRGaWxlU3luYygnLi4va2V5cy1hbmQtY2VydGlmaWNhdGVzL2tleS1yc2EucGVtJyksXHJcbiAgICAgIGNlcnQ6IGZzLnJlYWRGaWxlU3luYygnLi4va2V5cy1hbmQtY2VydGlmaWNhdGVzL2NlcnQucGVtJyksXHJcbiAgICB9XHJcbiAgfVxyXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sUUFBUTtBQUdmLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxLQUFLLEdBQUcsYUFBYSxzQ0FBc0M7QUFBQSxNQUMzRCxNQUFNLEdBQUcsYUFBYSxtQ0FBbUM7QUFBQSxJQUMzRDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
