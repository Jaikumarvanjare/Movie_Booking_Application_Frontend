interface SeatSelection {
  rowNumber: number;
  seatNumber: number;
}

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
