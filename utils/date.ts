export const formatSpanishDate = (date: Date): string => {
	const options: Intl.DateTimeFormatOptions = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	return date.toLocaleDateString("es-ES", options);
};

export const getDateKey = (date: Date): string => {
	const parts = date.toISOString().split("T");
	return parts[0] ?? "";
};

export const getTimeString = (): string => {
	return new Date().toLocaleTimeString("es-ES", {
		hour: "2-digit",
		minute: "2-digit",
	});
};
