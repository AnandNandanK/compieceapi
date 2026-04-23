import morgan from "morgan";
import { Request } from "express";


morgan.token("correlationId", (req: Request) => (req.correlationId ? req.correlationId : "-"));


const httpLogger = morgan(function (tokens, req, res) {
  return [
    `correlationId: [${tokens.correlationId(req, res)}]`,
    " ➡️ ",
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
    "---",
    tokens.date(req, res),
  ].join(" ");
});

export default httpLogger;
