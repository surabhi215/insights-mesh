export const generateSummary = async (payload: any) => {
  try {
    const messages = payload?.reduce(
      (acc: any, curr: any) =>
        acc + ` ${curr?.role}: ${curr?.parts?.[0]?.text}.\n`,
      ""
    );
    const res = await fetch("/api/get-summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      error:
        err.message || "An error occurred while fetching the chat response.",
    };
  }
};
