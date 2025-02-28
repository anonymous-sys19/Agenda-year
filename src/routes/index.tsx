import { createBrowserRouter } from "react-router-dom"
import SchedulePage from "./page"
import PublicSchedule from "./schedule/ScheduleView.tsx"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <SchedulePage />,
    },
    {
        path: "/schedule/:slug",
        element: <PublicSchedule />,
    },
])