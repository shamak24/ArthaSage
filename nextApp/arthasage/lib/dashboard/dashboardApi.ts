import { getDashboardData } from "./get-dashboard-data";

export function getAnalysis(userId: string) {
    const data = getDashboardData(userId);

    console.log("Dashboard Data:", data);

}