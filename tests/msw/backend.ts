import { setupServer } from "msw/node";
import { restHandlers } from "./rest";
import { delay, http, HttpResponse } from "msw";
import { database } from "./database";

export const backend = setupServer(...restHandlers);

export const simulateDelay = (endpoint: string) => {
  backend.use(
    http.get(endpoint, async () => {
      await delay();
      return HttpResponse.json([]);
    })
  );
};

export const simulateError = (endpoint: string) => {
  backend.use(
    http.get(endpoint, () => {
      return HttpResponse.error();
    })
  );
};

export const simulateNoTutorials = (endpoint: string) => {
  backend.use(http.get(endpoint, () => HttpResponse.json([])));
};

export const simulateCreateDummyTutorial = (endpoint: string) => {
  backend.use(
    http.post(endpoint, async () => {
      database.tutorial.create({
        id: 1,
        title: "Test1",
        description: "Desc1",
        published: false,
        filename: "file1",
      });

      // ...and respond to them using this JSON response.
      return HttpResponse.json({ status: 201 });
    })
  );
};
