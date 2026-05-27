interface SeatSelection {
  rowNumber: number;
  seatNumber: number;
}

const rowNumberToLabel = (rowNumber: number) => {
  let value = rowNumber;
  let label = "";

  while (value > 0) {
    value -= 1;
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26);
  }

  return label;
};

const rowLabelToNumber = (label: string) => {
  return label
    .toUpperCase()
    .split("")
    .reduce((value, character) => value * 26 + (character.charCodeAt(0) - 64), 0);
};

export const parseSeatSelection = (rawSeatInput: string): SeatSelection[] => {
  return rawSeatInput
    .split(",")
    .map((seat) => seat.trim())
    .filter(Boolean)
    .map((seat) => {
      const match = /^([A-Za-z]+)(\d+)$/.exec(seat);

      if (!match) {
        throw new Error(
          "Seat numbers must use the format A1, A2, B4 and be comma-separated."
        );
      }

      return {
        rowNumber: rowLabelToNumber(match[1]),
        seatNumber: Number(match[2])
      };
    });
};

export const serializeSeatSelection = (seats: SeatSelection[]) => {
  return JSON.stringify(seats);
};

const formatLegacySeatPayload = (rawSeat: string) => {
  const labels: string[] = [];
  const pairPattern =
    /rowNumber['"]?\s*:\s*(\d+)\s*,\s*['"]?seatNumber['"]?\s*:\s*(\d+)/gi;
  let match = pairPattern.exec(rawSeat);

  while (match) {
    const rowNumber = Number(match[1]);
    const seatNumber = Number(match[2]);
    if (rowNumber && seatNumber) {
      labels.push(`${rowNumberToLabel(rowNumber)}${seatNumber}`);
    }
    match = pairPattern.exec(rawSeat);
  }

  return labels.length > 0 ? labels.join(", ") : "";
};

export const formatSeatSelection = (seat?: string) => {
  if (!seat) return "";

  const rawSeat = seat.trim();
  if (!rawSeat) return "";

  try {
    const parsed = JSON.parse(rawSeat);
    if (Array.isArray(parsed)) {
      const labels = parsed
        .map((item) => {
          if (typeof item === "string") return item;
          const rowNumber = Number(item?.rowNumber);
          const seatNumber = Number(item?.seatNumber);
          if (!rowNumber || !seatNumber) return "";
          return `${rowNumberToLabel(rowNumber)}${seatNumber}`;
        })
        .filter(Boolean);

      if (labels.length > 0) {
        return labels.join(", ");
      }
    }
  } catch {
    return formatLegacySeatPayload(rawSeat) || rawSeat;
  }

  return formatLegacySeatPayload(rawSeat) || rawSeat;
};
