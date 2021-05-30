interface RequestOptions extends RequestInit {
  qs?: URLSearchParams;
}

class RestUtil {
  doRequest(path: RequestInfo, options: RequestInit = {}) {
    return fetch(path, options).then((response) => {
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        return response.json();
      } else if (response) {
        return response.text();
      }
    });
  }

  doApiRequest(path: string, options: RequestOptions = {}) {
    // const url = new URL(window.location.origin + "/api" + path);
    const url = new URL("http://localhost:3008/api" + path);
    url.search = options.qs?.toString() || "";

    return this.doRequest(url.toString(), options);
  }

  async getDirectory(path: string) {
    try {
      return await this.doApiRequest("/directory", {
        qs: new URLSearchParams({
          path
        })
      });
    } catch (err) {
      return { error: err };
    }
  }
}

export default new RestUtil();
