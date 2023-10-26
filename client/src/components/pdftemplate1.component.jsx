import React, { Fragment } from "react";
import jostRegular from "../fonts/Jost-Regular.ttf";
import jostBold from "../fonts/Jost-Bold.ttf";
import {
	Document,
	Page,
	Text,
	View,
	Font,
	StyleSheet,
} from "@react-pdf/renderer";

Font.register({
	family: "Jost",
	src: jostRegular,
	fontWeight: "normal",
});

Font.register({
	family: "Jost",
	src: jostBold,
	fontWeight: "bold",
});

const styles = StyleSheet.create({
	page: {
		fontFamily: "Jost",
		flexDirection: "row",
		backgroundColor: "000000",
	},
	section: {
		margin: 10,
		padding: 10,
		textAlign: "center",
		flexGrow: 1,
	},
	displayText: {
		fontWeight: "bold",
		fontSize: 14,
		color: "#075985",
		textAlign: "center",
		marginBottom: 5,
	},
	headerContainer: {
		marginTop: 20,
		flexDirection: "column",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
	headerDisplay: {
		marginBottom: 5,
		flexDirection: "column",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
	reportName: {
		color: "#075985",
		fontWeight: "bold",
		fontSize: 18,
	},
	dateText: {
		position: "absolute",
		bottom: 20,
		right: 20,
		fontSize: 10,
	},
	coveredDate: {
		fontSize: 10,
	},
	table: {
		display: "table",
		width: "auto",
		marginBottom: 20,
	},
	tableRow: {
		flexDirection: "row",
	},
	tableColHeader: {
		borderStyle: "solid",
		borderColor: "#2563eb",
		borderWidth: 1,
		borderLeftWidth: 0,
		borderRight: 0,
		borderTopWidth: 0,
	},
	tableCol: {
		borderStyle: "solid",
		borderColor: "#94a3b8",
		borderWidth: 1,
		borderLeftWidth: 0,
		borderRight: 0,
		borderTopWidth: 0,
	},
	tableCell: {
		margin: 5,
		fontSize: 10,
	},
	headerText: {
		color: "#075985",
		fontWeight: "bold",
		fontSize: 26,
		marginBottom: 5,
	},
	infoText: {
		fontSize: 12,
		textAlign: "center",
		marginBottom: 5,
	},
	horizontalLine: {
		borderTopWidth: 1,
		borderColor: "black",
		marginTop: 5,
	},
	headerRow: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		borderBottomWidth: 0,
	},
	headerCol: {
		width: "33%",
		borderStyle: "solid",
		borderWidth: 0,
	},
	lineContainer: {
		marginTop: 20,
		marginBottom: 30,
	},
});

const renderTable = (data, columns, totalWidth) => {
	const columnWidth = totalWidth / columns.length;

	return (
		<View style={{ ...styles.table, width: totalWidth }}>
			<View style={styles.tableRow}>
				{columns.map((column, index) => (
					<View
						key={index}
						style={{ ...styles.tableColHeader, width: columnWidth }}
					>
						<Text style={styles.tableCell}>{column.header}</Text>
					</View>
				))}
			</View>
			{data.map((row, rowIndex) => (
				<View key={rowIndex} style={styles.tableRow}>
					{columns.map((column, columnIndex) => (
						<View
							key={columnIndex}
							style={{ ...styles.tableCol, width: columnWidth }}
						>
							<Text style={styles.tableCell}>{row[column.field]}</Text>
						</View>
					))}
				</View>
			))}
		</View>
	);
};

function chunkArray(arr, chunkSize) {
	const chunks = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
		chunks.push(arr.slice(i, i + chunkSize));
	}
	return chunks;
}

const ReportPDF = (data) => {
	let tableHeaders = Object.keys(data.data[0]).filter(
		(name) =>
			name !== "headerText" && name !== "dateStart" && name !== "dateEnd"
	);
	let tableFields;
	let totalWidth = 550; // Set the total available width for the table

	// Check if data contains an array
	const containsArray = data.data.some((row) =>
		tableHeaders.some((header) => Array.isArray(row[header]))
	);
	if (containsArray) {
		tableFields = Object.keys(data.data[0].header[0]);
		tableHeaders = Object.keys(data.data[0].data[0]);
	}

	return (
		<Document>
			<Page wrap={false} size="LEGAL" style={styles.page}>
				<View style={styles.section}>
					<Text style={styles.headerText}>Maderal Optical</Text>
					<Text style={styles.infoText}>Pinagbuhatan, Pasig City</Text>
					<View style={styles.headerRow}>
						<View style={styles.headerCol}>
							<Text style={styles.infoText}>Email: example@example.com</Text>
						</View>
						<View style={styles.headerCol}>
							<Text style={styles.infoText}>Mobile: (123) 456-7890</Text>
						</View>
						<View style={styles.headerCol}>
							<Text style={styles.infoText}>
								Website: www.maderaloptical.com
							</Text>
						</View>
					</View>

					<View style={styles.lineContainer}>
						<View style={styles.horizontalLine}></View>
						<View style={styles.horizontalLine}></View>
						<View style={styles.headerContainer}>
							<Text style={styles.reportName}>{data.data[0].headerText}</Text>
							<Text style={styles.coveredDate}>
								{data.data[0].dateEnd
									? `Covered Date: ` + data.data[0].dateEnd
									: "as of "}
								{data.data[0].dateEnd && " - "}
								{data.data[0].dateStart}
							</Text>
						</View>
					</View>

					{tableFields && (
						<View style={styles.headerDisplay}>
							<View style={{ alignSelf: "center" }}>
								{data.data.map((row, rowIndex) => (
									<View key={rowIndex}>
										{row.header[0] && (
											<View key={0}>
												{Object.entries(row.header[0]).map(
													([key, value], index) => (
														<Fragment key={index}>
															{index === 0 && (
																<View style={styles.headerDisplay}>
																	<Text key={key} style={styles.displayText}>
																		{value}
																	</Text>
																</View>
															)}
														</Fragment>
													)
												)}
												{row.header[0] &&
													chunkArray(
														Object.entries(row.header[0]).slice(1),
														3
													).map((chunk, chunkIndex) => (
														<View
															key={chunkIndex}
															style={{
																flexDirection: "row",
																justifyContent: "center",
																marginBottom: 20,
															}}
														>
															{chunk.map(([key, value], index) => (
																<View style={styles.headerCol} key={index}>
																	<Text style={styles.coveredDate}>
																		{key}: {value}
																	</Text>
																</View>
															))}
														</View>
													))}
											</View>
										)}

										{containsArray && (
											<View style={styles.tableRow}>
												{renderTable(
													row.data,
													tableHeaders.map((header) => ({
														header,
														field: header,
													})),
													totalWidth
												)}
											</View>
										)}
									</View>
								))}
							</View>
						</View>
					)}

					{!tableFields &&
						renderTable(
							data.data,
							tableHeaders.map((header) => ({
								header,
								field: header,
							})),
							totalWidth
						)}
					<View style={{ marginTop: 30 }}>
						<Text style={styles.dateText}>
							Date Generated: {new Date().toLocaleDateString()}
							{" | "}
							{new Date().toLocaleTimeString()}
						</Text>
					</View>
				</View>
			</Page>
		</Document>
	);
};

export default ReportPDF;
