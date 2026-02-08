import { createRoutesStub } from "react-router";
import { describe, expect, test } from "vitest";

import { createPopulatedTodo } from "../infrastructure/todos-factories.server";
import { TodosPageComponent } from "./todos-page";
import { render, screen } from "~/test/react-test-utils";

const defaultCounts = { active: 0, completed: 0, total: 0 };

describe("TodosPageComponent", () => {
  test("given: no todos, should: render empty state message", () => {
    const path = "/";
    const RouterStub = createRoutesStub([
      {
        Component: () => (
          <TodosPageComponent counts={defaultCounts} filter="all" todos={[]} />
        ),
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);

    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });

  test("given: todos, should: render the todo list with status counts", () => {
    const todos = [
      createPopulatedTodo({ completed: false, id: "1", title: "First" }),
      createPopulatedTodo({ completed: true, id: "2", title: "Second" }),
    ];
    const path = "/";
    const RouterStub = createRoutesStub([
      {
        Component: () => (
          <TodosPageComponent
            counts={{ active: 1, completed: 1, total: 2 }}
            filter="all"
            todos={todos}
          />
        ),
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);

    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.getByText("1 active")).toBeInTheDocument();
    expect(screen.getByText("1 completed")).toBeInTheDocument();
  });

  test("given: the page, should: render the add todo form", () => {
    const path = "/";
    const RouterStub = createRoutesStub([
      {
        Component: () => (
          <TodosPageComponent counts={defaultCounts} filter="all" todos={[]} />
        ),
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);

    expect(
      screen.getByPlaceholderText(/what needs to be done/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add todo/i }),
    ).toBeInTheDocument();
  });

  test("given: actionData with TITLE_EMPTY error, should: display title required message", () => {
    const path = "/";
    const RouterStub = createRoutesStub([
      {
        Component: () => (
          <TodosPageComponent
            actionData={{ error: "TITLE_EMPTY", success: false }}
            counts={defaultCounts}
            filter="all"
            todos={[]}
          />
        ),
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);

    expect(screen.getByRole("alert")).toHaveTextContent(/title is required/i);
  });

  test("given: actionData with DESCRIPTION_TOO_LONG error, should: display description error message", () => {
    const path = "/";
    const RouterStub = createRoutesStub([
      {
        Component: () => (
          <TodosPageComponent
            actionData={{ error: "DESCRIPTION_TOO_LONG", success: false }}
            counts={defaultCounts}
            filter="all"
            todos={[]}
          />
        ),
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      /description must be 1000 characters or less/i,
    );
  });

  test("given: no actionData, should: not display any error", () => {
    const path = "/";
    const RouterStub = createRoutesStub([
      {
        Component: () => (
          <TodosPageComponent counts={defaultCounts} filter="all" todos={[]} />
        ),
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  test("given: active filter with no active todos but total > 0, should: display filtered empty state", () => {
    const path = "/";
    const RouterStub = createRoutesStub([
      {
        Component: () => (
          <TodosPageComponent
            counts={{ active: 0, completed: 2, total: 2 }}
            filter="active"
            todos={[]}
          />
        ),
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);

    expect(screen.getByText(/no active todos/i)).toBeInTheDocument();
  });

  test("given: completed todos exist, should: show clear completed button", () => {
    const todos = [
      createPopulatedTodo({ completed: true, id: "1", title: "Done" }),
    ];
    const path = "/";
    const RouterStub = createRoutesStub([
      {
        Component: () => (
          <TodosPageComponent
            counts={{ active: 0, completed: 1, total: 1 }}
            filter="all"
            todos={todos}
          />
        ),
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);

    expect(
      screen.getByRole("button", { name: /clear completed/i }),
    ).toBeInTheDocument();
  });

  test("given: no completed todos, should: hide clear completed button", () => {
    const todos = [
      createPopulatedTodo({ completed: false, id: "1", title: "Active" }),
    ];
    const path = "/";
    const RouterStub = createRoutesStub([
      {
        Component: () => (
          <TodosPageComponent
            counts={{ active: 1, completed: 0, total: 1 }}
            filter="all"
            todos={todos}
          />
        ),
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);

    expect(
      screen.queryByRole("button", { name: /clear completed/i }),
    ).not.toBeInTheDocument();
  });
});
