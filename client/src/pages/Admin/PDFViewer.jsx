import { PDFViewer } from "@react-pdf/renderer";
import ReportPDF from "../../components/pdftemplate1.component";

function PDFView() {
	const pathname = window.location.pathname;
	const parts = pathname.split("/"); // Split the pathname by '/'
	const sessionData = parts[parts.length - 1]; // Get the last part of the split array
	const data = JSON.parse(sessionStorage.getItem(`${sessionData}`));

	return (
		<PDFViewer className="w-full h-full overflow-auto">
			<ReportPDF data={data} />
		</PDFViewer>
	);
}

export default PDFView;
