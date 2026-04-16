import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
      <>
      <header>
        Heading
      </header>
    <main className="">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
       Main Home Section
      </section>
    </main>
        <footer>Footer</footer>
      </>
  )
}
