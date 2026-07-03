import { Link } from "react-router"

import * as s from "./landing-page.css"
import { cx } from "~/utils/class-name"

const demoTasks = [
  ["Plan the weekly reset", "Today"],
  ["Review project notes", "Next"],
  ["Send the grocery list", "Later"],
] as const

const benefits = [
  ["Capture fast", "Add the next thing before it turns into mental clutter."],
  [
    "See what matters",
    "Filter active and completed work so your list stays readable.",
  ],
  [
    "Come back anywhere",
    "Your todos are saved to your account and ready on the next visit.",
  ],
] as const

export function LandingPageComponent() {
  return (
    <main className={s.page}>
      <div className={s.shell}>
        <nav aria-label="Main" className={s.nav}>
          <Link className={s.brand} to="/">
            Todo Demo
          </Link>
          <div className={s.navActions}>
            <Link className={s.linkButton.ghost} to="/auth/signin">
              Sign in
            </Link>
            <Link className={s.linkButton.default} to="/auth/signup">
              Start free
            </Link>
          </div>
        </nav>

        <section className={s.hero}>
          <div>
            <p className={s.eyebrow}>A focused todo app for busy days</p>
            <h1 className={s.title}>Turn scattered tasks into a clear plan.</h1>
            <p className={s.lead}>
              Todo Demo gives you a simple place to capture work, sort what is
              active, and check off progress without configuring a whole system.
            </p>
            <div className={s.ctaRow}>
              <Link
                className={cx(s.linkButton.default, s.largeLinkButton)}
                to="/auth/signup"
              >
                Create your todo list
              </Link>
              <Link
                className={cx(s.linkButton.outline, s.largeLinkButton)}
                to="/auth/signin"
              >
                I already have an account
              </Link>
            </div>
            <p className={s.reassurance}>
              No setup checklist. Sign up, add your first task, and start
              moving.
            </p>
          </div>

          <section aria-label="Todo list preview" className={s.previewCard}>
            <div className={s.previewHeader}>
              <p className={s.previewTitle}>Today&apos;s list</p>
              <p className={s.previewMeta}>3 open tasks</p>
            </div>
            <div className={s.taskList}>
              {demoTasks.map(([task, status]) => (
                <div className={s.task} key={task}>
                  <span aria-hidden="true" className={s.checkbox} />
                  <span className={s.taskText}>{task}</span>
                  <span className={s.taskStatus}>{status}</span>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section aria-label="Why use Todo Demo" className={s.sections}>
          {benefits.map(([title, copy]) => (
            <article className={s.sectionCard} key={title}>
              <h2 className={s.sectionTitle}>{title}</h2>
              <p className={s.sectionCopy}>{copy}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
