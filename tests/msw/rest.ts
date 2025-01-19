import { http, HttpResponse } from "msw";
import { log } from "../../src/utils/log";
import { database } from "./database";
import { Repository } from "../../src/entities/repository";

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const tutorialRestHandler = [
  http.get("/repository/default", () => {
    log(true, "REST", "INTERCEPT DEFAULT REPOSITORY CALL");
    const repository = database.repository.findFirst({
      where: {
        selected: {
          equals: true,
        },
      },
    });

    if (repository) {
      log(true, "REST", "DEFAULT REPOSITORY", repository, true);
    }

    return HttpResponse.json(repository);
  }),
  http.get("/repository/find", () => {
    log(true, "REST", "INTERCEPT FIND ALL REPOSITORIES CALL");
    const repositories = database.repository.findMany({});

    if (repositories) {
      log(true, "REST", "REPOSITORIES", repositories, true);
    }

    return HttpResponse.json(repositories);
  }),
  http.get("/find", () => {
    log(true, "REST", "INTERCEPT FIND CALL");
    const tutorials = database.tutorial.findMany({});

    if (tutorials) {
      log(true, "REST", "FIND TUTORIALS", tutorials, true);
    }

    return HttpResponse.json(tutorials);
  }),
  http.get("/find/published", ({ request }) => {
    const url = new URL(request.url);
    const pub = url.searchParams.get("published");
    log(true, "REST", "INTERCEPT FIND PUBLISHED CALL", pub!);

    if (pub === "true") {
      return HttpResponse.json(
        database.tutorial.findMany({
          where: {
            published: {
              equals: true,
            },
          },
        })
      );
    }

    return HttpResponse.json(
      database.tutorial.findMany({
        where: {
          published: {
            equals: false,
          },
        },
      })
    );
  }),
  http.get("/settings/type", ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    log(true, "REST", "INTERCEPT FIND SETTINGS OF TYPE", type!);

    const settings = database.setting.findMany({
      where: {
        type: {
          equals: type!,
        },
      },
    });

    return HttpResponse.json(settings);
  }),
  http.get("/find/:tid", ({ params }) => {
    let tid = parseInt(params.tid as string);
    log(true, "REST", "INTERCEPT FIND WITH ID", tid);

    let tutorial = database.tutorial.findFirst({
      where: { id: { equals: tid } },
    });

    if (tutorial) {
      return HttpResponse.json([tutorial]);
    }

    return HttpResponse.json([]);
  }),
  http.get("/find/keywords/:keywords", ({ params }) => {
    let keyword: string = params.keywords as string;
    log(true, "REST", "INTERCEPT FIND WITH KEYWORD", keyword);

    if (keyword != undefined) {
      return HttpResponse.json(
        database.tutorial.findMany({
          where: {
            title: {
              contains: keyword,
            },
          },
        })
      );
    }

    return HttpResponse.json([]);
  }),
  http.delete("/delete/:id", ({ params }) => {
    let id = parseInt(params.id as string);
    log(true, "REST", "INTERCEPT DELETE WITH ID", id);

    let tutorial = database.tutorial.delete({ where: { id: { equals: id } } });

    return HttpResponse.json(tutorial);
  }),
  http.put("/publish/:id", ({ params }) => {
    let id = parseInt(params.id as string);
    log(true, "REST", "INTERCEPT PUBLISH WITH ID", id);

    const repo = database.repository.findFirst({
      where: {
        selected: {
          equals: true,
        },
      },
    });

    if (repo === null) {
      log(true, "REST", "(PUBLISH) DEFAULT REPO NOT SET");
      return new HttpResponse("No default Repository", {
        status: 404,
        statusText: "No Default Repository Set",
      });
    }

    database.tutorial.update({
      where: { id: { equals: id } },
      data: { published: true },
    });

    return HttpResponse.json({ status: 200 });
  }),
  http.delete("/delete", () => {
    database.tutorial.deleteMany({
      where: {
        id: {
          gt: 0,
        },
      },
    });

    return HttpResponse.json({ status: 200 });
  }),
  http.put("/publish", () => {
    database.tutorial.updateMany({
      where: { published: { equals: false } },
      data: { published: true },
    });

    return HttpResponse.json({ status: 200 });
  }),
];

export const restHandlers = [...tutorialRestHandler];
