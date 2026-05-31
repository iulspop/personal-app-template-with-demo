import { afterEach, describe, expect, test } from "vitest";

import {
  retrieveUserFromDatabaseByEmail,
  retrieveUserFromDatabaseById,
  saveUserToDatabase,
} from "./users-model.server";
import { prisma } from "~/utils/db.server";

const createdUserIds: string[] = [];

afterEach(async () => {
  if (createdUserIds.length > 0) {
    await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    createdUserIds.length = 0;
  }
});

const createTestUser = async (data: { email: string }) => {
  const user = await saveUserToDatabase(data);
  createdUserIds.push(user.id);
  return user;
};

describe("saveUserToDatabase()", () => {
  test("given: valid email-only user data, should: create and return the user", async () => {
    const result = await createTestUser({
      email: "test@example.com",
    });

    expect(result).toMatchObject({
      email: "test@example.com",
    });
    expect(result.id).toBeDefined();
  });
});

describe("retrieveUserFromDatabaseById()", () => {
  test("given: an existing id, should: return the user", async () => {
    const created = await createTestUser({
      email: "find@example.com",
    });

    const found = await retrieveUserFromDatabaseById(created.id);

    expect(found).toMatchObject({ email: "find@example.com", id: created.id });
  });

  test("given: a non-existent id, should: return null", async () => {
    const found = await retrieveUserFromDatabaseById("non-existent");

    expect(found).toBeNull();
  });
});

describe("retrieveUserFromDatabaseByEmail()", () => {
  test("given: an existing email, should: return the user", async () => {
    await createTestUser({
      email: "lookup@example.com",
    });

    const found = await retrieveUserFromDatabaseByEmail("lookup@example.com");

    expect(found).toMatchObject({
      email: "lookup@example.com",
    });
  });

  test("given: a non-existent email, should: return null", async () => {
    const found = await retrieveUserFromDatabaseByEmail("missing@example.com");

    expect(found).toBeNull();
  });
});
