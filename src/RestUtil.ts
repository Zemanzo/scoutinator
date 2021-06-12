interface RequestOptions extends RequestInit {
  qs?: URLSearchParams;
}

class RestUtil {
  doRequest(path: RequestInfo, options: RequestInit = {}) {
    return fetch(path, options).then((response) => {
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        return response.json();
      } else if (response.headers.get("Content-Type")?.includes("application/octet-stream")) {
        return response.blob();
      } else if (response) {
        return response.text();
      }
    });
  }

  doApiRequest(path: string, options: RequestOptions = {}) {
    return this.doRequest(
      this.generateApiUrl(path, options),
      options
    );
  }

  generateApiUrl(path: string, options: RequestOptions = {}) {
    // const url = new URL(window.location.origin + "/api" + path);
    const url = new URL("http://localhost:3008/api" + path);
    url.search = options.qs?.toString() || "";
    return url.toString();
  }

  async getDirectory(path: string) {
    try {
      return await this.doApiRequest("/directory", {
        qs: new URLSearchParams({
          path: encodeURIComponent(path),
        }),
      });
    } catch (err) {
      return { error: err };
    }
  }

  getImageUrl(path: string) {
    try {
      return this.generateApiUrl("/image", {
        qs: new URLSearchParams({
          path: encodeURIComponent(path),
        }),
      });
    } catch (err) {
      return "invalidPath";
    }
  }
}

export default new RestUtil();
