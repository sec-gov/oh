//Rule 606 Report Generator was created by staff of the U.S. Securities and Exchange Commission.
//Data and content created by government employees within the scope of their employment
//are not subject to domestic copyright protection. 17 U.S.C. 105.

const a1SectionHeaders = [ 'S&P 500 Stocks', 'Non-S&P 500 Stocks', 'Options' ];
const a1SectionTags = [ 'rSP500', 'rOtherStocks', 'rOptions' ];

const a1SummaryTableHeaders = [ 'Non-Directed Orders as % of All Orders',
		'Market Orders as % of Non-Directed Orders',
		'Marketable Limit Orders as % of Non-Directed Orders',
		'Non-Marketable Limit Orders as % of Non-Directed Orders',
		'Other Orders as % of Non-Directed Orders' ];
const a1SummaryTableTags = [ 'ndoPct', 'ndoMarketPct', 'ndoMarketableLimitPct',
		'ndoNonmarketableLimitPct', 'ndoOtherPct' ];

const a1VenueTableHeaders = [
		'Venue - \nNon-directed Order Flow',
		'Non-Directed Orders (%)',
		'Market Orders (%)',
		'Marketable Limit Orders (%)',
		'Non-Marketable Limit Orders (%)',
		'Other Orders (%)',
		'Net Payment Paid/Received for Market Orders(USD)',
		'Net Payment Paid/Received for Market Orders(cents per hundred shares)',
		'Net Payment Paid/Received for Marketable Limit Orders(USD)',
		'Net Payment Paid/Received for Marketable Limit Orders(cents per hundred shares)',
		'Net Payment Paid/Received for Non-Marketable Limit Orders(USD)',
		'Net Payment Paid/Received for Non-Marketable Limit Orders(cents per hundred shares)',
		'Net Payment Paid/Received for Other Orders(USD)',
		'Net Payment Paid/Received for Other Orders(cents per hundred shares)' ];
const a1VenueTableTags = [ 'orderPct', 'marketPct', 'marketableLimitPct',
		'nonMarketableLimitPct', 'otherPct', 'netPmtPaidRecvMarketOrdersUsd',
		'netPmtPaidRecvMarketOrdersCph',
		'netPmtPaidRecvMarketableLimitOrdersUsd',
		'netPmtPaidRecvMarketableLimitOrdersCph',
		'netPmtPaidRecvNonMarketableLimitOrdersUsd',
		'netPmtPaidRecvNonMarketableLimitOrdersCph',
		'netPmtPaidRecvOtherOrdersUsd', 'netPmtPaidRecvOtherOrdersCph' ];

const b1TableHeaders = [ 'Order ID', 'Type', 'Venue', 'Time of Transaction (UTC)' ];
const b1OrderTags = [ 'orderId', 'directed', 'route' ];
const b1RouteTags = [ 'venueName', 'mic', 'transaction' ]
const b1TransactionTags = [ 'date', 'time' ];

const b3SummaryTableHeaders = [ 'Total Shares Sent to Broker/Dealer',
		'Total Number of Shares Executed as Principal',
		'Total Orders Exposed (Actionable IOI)' ];
const b3SummaryTableTags = [ 'sentShr', 'executedAsPrincipalShr', 'ioiExposedOrd' ];

const b3DetailTableHeaders = [
		'Venue',
		'Total Shares Routed',
		'Total Shares Routed Marked IOC',
		'Total Shares Routed that were further Routable',
		'Average Order Size Routed',
		'Total Shares Executed',
		'Fill Rate',
		'Average Fill Size',
		'Average Net Execution Fee or (Rebate)',
		'Total Shares Executed at Midpoint',
		'Percentage of Shares Executed at Midpoint',
		'Total Shares Executed that were Priced at the Near Side',
		'Percentage of Total Shares Executed that were Priced at the Near Side',
		'Total Shares Executed that were Priced at the Far Side',
		'Percentage of Total Shares Executed that were Priced at the Far Side',
		'Total Number of Shares that Provided Liquidity',
		'Percentage of Executed Shares that Provided Liquidity',
		'Average Duration of Orders that Provided Liquidity (in msec)',
		'Average Net Execution Rebate (or Fee Paid) for Shares that Provided Liquidity',
		'Total Number of Shares that Removed Liquidity',
		'Percentage of Executed Shares that Removed Liquidity',
		'Average Net Execution Fee (or rebate received) for Shares that Removed Liquidity' ];

const b3DetailTableTags = [ 'routedShr', 'iocRoutedShr', 'furtherRoutableShr',
		'orderSizeShr', 'executedShr', 'filledPct', 'fillSizeShr',
		'netFeeOrRebateCph', 'midpointShr', 'midpointPct', 'nearsideShr',
		'nearsidePct', 'farsideShr', 'farsidePct', 'providedLiqudityShr',
		'providedLiquidityPct', 'orderDurationMsec', 'providedLiquidityNetCph',
		'removedLiquidityShr', 'removedLiquidityPct', 'removedLiquidityNetCph' ];

const monthEnum = {
	January : 1,
	February : 2,
	March : 3,
	April : 4,
	May : 5,
	June : 6,
	July : 7,
	August : 8,
	September : 9,
	October : 10,
	November : 11,
	December : 12
};

const NS = ''; /* null string */
const WS = ' '; /* one whitespace */
const NL = '\n';
const AUTO = 'auto';
const TEXTSTYLE = 'textStyle';
const TABLEVALUE = 'tableValue';
const COMPRESS = false; /* For debugging, set false so as to inspect pdf output. */
const FILLCOLOR = '#CCE6FF'; /* blue */	
const FAILCOLOR = '#FFCCE6'; /* pink */
const GRAYCOLOR = '#CCCCCC'; /* gray */
var basename = null;

var xsdContent, xmlDoc, matrAspectsArr, detailData;
var hasTimeStamp = false;

/******* b1 *******/

function createHeldExemptNotHeldOrderRoutingCustomerReport() { /* b1 */
	memoryStatInitialize();
	var docStyles = {
		header : { fontSize : 16, bold : true, alignment : 'center' },
		header3 : { fontSize : 10, bold : true, alignment : 'center', lineHeight: 1.2 },
		header4 : { fontSize : 8, bold : true, alignment : 'center', lineHeight: 1.2 },
		sectionHeader : { fontSize : 12, bold : true, alignment : 'left', lineHeight: 1.2 },
		subSectionHeader : { fontSize : 10, bold : true, alignment : 'left', lineHeight: 1.2 },
		textStyle : { fontSize : 8 },
		tableHeader : { fontSize : 9, bold : true, alignment : 'center', fillColor : FILLCOLOR },
		tableValue : { fontSize : 8, alignment : 'left' },
		tableNameValue : { fontSize : 9, alignment : 'left' },
		failHeader: { fontSize: 9, bold: true, alignment : 'center', fillColor : FAILCOLOR }
	}
	var roots = [
			[ 'held', 'Held NMS Stocks' ],
			[ 'notHeldExempt', 'Exempt Not-Held NMS stocks',  ],
			[ 'options', 'Options Customer Routing Report' ]
	];
	var outname = ((basename == null) ? '606b1_HeldExemptNotHeldOrderRoutingCustomerReport' : removeExtension(basename.name));
	var threshold = 500; // number of transactions in a single pdf report file, about 10 pages
	var truncate = true;
	var hasoutput = false;
	// memoryStat('After XML loaded',false);
	for (var i = 0; i < roots.length; i++) {
		var title = roots[i][1];
		var body = getprivateData(roots[i][0]);
		if (body.length == 0) {
			break;
		}
		var columnHeadings = body[0];
		var chunks = [];
		var chunk = [];
		var failText = null;
		var accumulated = 0;
		for (var j = 1; j < body.length; j++) {
			var order = body[j];
			var orderId = order[0];
			var cellSize = ((orderId.hasOwnProperty('rowSpan')) ? orderId.rowSpan : 1);
			if (accumulated == 0) {
				chunk = [];
				chunk.push(columnHeadings);
			}
			if ((accumulated + cellSize) > threshold) {
				if (truncate) {
					failText = 'Unable to render more than '+threshold+' '+title+' transactions.\nOpen larger 606(b)(1) XML files in a spreadsheet or other application.'
					alert(failText);
				}
				chunks.push(chunk);
				chunk = [];
				accumulated = 0;
				if (truncate) {
					break;
				}
			}
			accumulated += 1;
			chunk.push(order);
		}
		if (accumulated > 0) {
			chunks.push(chunk);
		}
		for (var j = 0; j < chunks.length; j++) {
			hasoutput = true;
			chunk = chunks[j];
			var content = [];
			content.push(
					{text: getElementValue('bd') + ' - ' + title, tags: ['Div','H','/H'], style: 'header', unbreakable:true},
			((hasTimeStamp) ? {
				text: [ {text: 'Generated on ',
						  style: 'header3', unbreakable:true},
						{text: formatDate(getElementValue('timestamp')), style: TEXTSTYLE},
				], tags: ['H1','/H1']} : NS), {
				tags: ['H1','/H1'],
				text: [ {
					text: ' For ',
					style: 'header3', unbreakable:true
				}, {
					text: getElementValue('customer'),
					style: TEXTSTYLE, unbreakable:true
				} ]},
				{
				text: [{text: ' Reporting Period ', style: 'header3', unbreakable:true},
						{text: getElementValue('startDate') + ' to ' + getElementValue('endDate'), style: TEXTSTYLE, unbreakable:true}],
				tags: ['H1','/H1','/Div']}
				);
			content.push(NL, {
				tags: ['Caption','/Caption'],
				text: 'Orders - ' + title + (chunks.length > 1 ? ' Part ' + j : NS) + NL,
				style: 'sectionHeader', unbreakable:true
			},
			{table: {
					body : chunk,
					tags: ['Table'],
					headerRows : 1,
					widths : [ AUTO, AUTO, AUTO, AUTO ]
				}
			});
			if (failText != null) {
				content.push({
					table: {widths: [AUTO],
							body : [[{	text: failText, 
										tags: ['/Table','Table','TR','TH','/TH','/TR','/Table'],
										style: 'failHeader'}]]}});
			}
			chunks[j] = null;
			var docDefinition = {
				info: {title : title},
				lang: 'en-US',
				marked: true,
				tabs: 'S',
				displayDocTitle: true,
				compress : COMPRESS,
				content : content,
				styles : docStyles
			};
			var name = outname + '_section_' + (i+1) + ((j == 0) ? NS : '_file_' + (j+1));
			const pdf = pdfMake.createPdf(docDefinition);
			const filename = name + '.pdf';
			docDefinition = null;
			pdf.download(name + '.pdf')
			// memoryStat('After generating '+filename,false);
		}
	}
	if (!hasoutput) {
		alert('No transactions in '+basename.name+', no output files.');
	}
}

function getprivateData(orderType) { /* b1 */
	var orderlist = xmlDoc.getElementsByTagName(orderType);
	var orders = [];
	var rows = [];
	$.each(orderlist, function(index, val) {
		orders = val.getElementsByTagName('order');
		var row = [];
		$.each(b1TableHeaders, function(index, val) {
			row.push({
				text: val,
				tags: ((index==0) ? ['Table','TR'] : [])
						.concat(['TH','/TH'])
						.concat((index  == (b1TableHeaders.length - 1)) ? ['/TR'] : [] ),
				style: 'tableHeader', unbreakable:true
			});
		});
		rows.push(row);
		$.each(orders, function(orderIndex, order) {
			var isFirstOrder = (orderIndex == 0);
			var isLastOrder = (orderIndex == (order.length - 1));
			var routes = [];
			var type = NS;
			var orderId = NS;
			var orderChildNodes = order.childNodes;
			$.each(orderChildNodes, function(oChildIndex, oChild) {
				if (oChild.tagName == b1OrderTags[0]) {
					orderId = getNodeValue(oChild, true);
				} else if (oChild.tagName == b1OrderTags[1]) {
					if (getNodeValue(oChild) == 'Y') {
						type = 'Directed';
					} else {
						type = 'Non-Directed';
					}
				} else if (oChild.tagName == b1OrderTags[2]) {
					routes.push(oChild);
				}
			});
			var orderRowSpan = 0;
			$.each(routes, function(rtIndex, route) {
				var transactionCount = 0;
				$.each(route.childNodes, function(rtChildIndex, rtChild) {
					if (rtChild.tagName == b1RouteTags[2]) {
						transactionCount += 1;
					}
				});
				transactionCount = Math.max(1, transactionCount);
				route.routeRowSpan = transactionCount;
				orderRowSpan += transactionCount;
			});
			if (routes.length < 1) {
				row = [];
				bdr = [true,true,true,true]; /* l,t,r,b */
				row.push({text: orderId, tags: ['TR','TD','/TD'], style: TABLEVALUE, unbreakable:true,border: bdr});
				row.push({text: type, tags: ['TD','/TD'], style: TABLEVALUE, unbreakable:true,border: bdr});
				row.push({text: WS, tags: ['TD','/TD'], style: TABLEVALUE, unbreakable:true,border:bdr});
				row.push({text: WS, tags: ['TD','/TD','/TR'], style: TABLEVALUE, unbreakable:true,border:bdr});
				rows.push(row);
			} else {
				$.each(routes, function(rtIndex, route) {
					row = [];
					var venueName = NS;
					var mic = NS;
					var isFirstRoute = (rtIndex == 0);
					var isLastRoute = (rtIndex == (routes.length - 1))
					var rtChildNodes = route.childNodes;
					var transactions = [];
					$.each(rtChildNodes, function(rtChildIndex, rtChild) {
						/* construct venue name and count transactions */
						if (rtChild.tagName == b1RouteTags[0]) {
							venueName = getNodeValue(rtChild);
						} else if (rtChild.tagName == b1RouteTags[1]) {
							if (venueName != NS) {
								venueName = venueName + ' (' + getNodeValue(rtChild) + ')';
							} else {
								venueName = getNodeValue(rtChild);
							};
						} else if (rtChild.tagName == b1RouteTags[2]) {
							transactions.push(rtChild);
						}
					});
					if (transactions.length == 0) {
						row = [];
						col1 = ((isFirstRoute)?orderId:WS);
						col2 = ((isFirstRoute)?type:WS);
						col3 = (venueName);
						col4 = ('-');
						bdr = [true,isFirstRoute,true,isLastRoute]; /* l,t,r,b */
						row.push({text: col1, tags: ['TR','TD','/TD'], style: TABLEVALUE, unbreakable:true,border:bdr});
						row.push({text: col2, tags: ['TD','/TD'], style: TABLEVALUE, unbreakable:true,border:bdr});
						bdr = [true,true,true,true]; /* l,t,r,b */
						row.push({text: col3, tags: ['TD','/TD'], style: TABLEVALUE, unbreakable:true,border:bdr});
						row.push({text: col4, tags: ['TD','/TD','/TR'], style: TABLEVALUE, unbreakable:true,border:bdr});
						rows.push(row);
					} else {
						$.each(transactions, function(txIndex, transaction) {
							row = [];
							isFirstTransaction = (txIndex == 0);
							isLastTransaction = (txIndex == (transactions.length-1));
							col1 = ((isFirstRoute && isFirstTransaction)?orderId:WS);
							col2 = ((isFirstRoute && isFirstTransaction)?type:WS);
							col3 = ((isFirstTransaction)?venueName:WS);
							col4 = ((transactions.length==0)?'-':getTransactionDate(transaction));
							bdr = [true,isFirstRoute&&isFirstTransaction,true,isLastRoute && isLastTransaction]; /* l,t,r,b */
							row.push({text: col1, tags: ['TR','TD','/TD'], style: TABLEVALUE, unbreakable:true,border:bdr});
							row.push({text: col2, tags: ['TD','/TD'], style: TABLEVALUE, unbreakable:true,border:bdr});
							bdr = [true,isFirstRoute&&isFirstTransaction,true,isLastTransaction]; /* l,t,r,b */
							row.push({text: col3, tags: ['TD','/TD'], style: TABLEVALUE, unbreakable:true,border:bdr});
							bdr = [true,isFirstRoute&&isFirstTransaction,true,true];
							row.push({text: col4, tags: ['TD','/TD','/TR'], style: TABLEVALUE, unbreakable:true,border:bdr});
							rows.push(row);
						});
					};
				});
			}
		});
	});
	return rows;
}

function getTransactionDate(transaction) { /* b1 */
	var date = NS;
	$.each(transaction.childNodes, function(txChildIndex, txChild) {
		if (txChild.tagName == b1TransactionTags[0]) {
			date += getNodeValue(txChild, true);
		} else if (txChild.tagName == b1TransactionTags[1]) {
			date += WS + getNodeValue(txChild, true);
		}
	});
	return date;
}

/****** b3 *******/

function createNotHeldOrderHandlingCustomerReportPDF(opts) { /* b3 */
	var content = [];
	var outname = ((basename == null) ? '606b3_NotHeldOrderHandling' : removeExtension(basename.name));
	var title = 'Not-Held NMS Stocks Order Handling Report';
	content.push(
	// Header
	{text: getElementValue('bd') + ' - ' + title, style: 'header', unbreakable:true, tags: ['H','/H']},
	((hasTimeStamp) ? {tags: ['H1','/H1'],
	                    style: 'header4', unbreakable:true,
	                    text: 'Generated on ' + formatDate(getElementValue('timestamp'))}
		            : {text: ' - ', tags: []}),
	{ tags: ['H2', '/H2'],
	  text : [ { text : ' For ',
		     style : 'header3' },
		   { text : getElementValue("customer"),
		     style : TEXTSTYLE } ] },
	{ tags: ['H2', '/H2'],
	  text : [ { text : ' Reporting Period ',
		     style : 'header3' },
		   { text : getElementValue("startDate") + ' to ' + getElementValue("endDate"),
		     style : TEXTSTYLE }
		 ]});
	var years = getAllYears();
	$.each(years,
			function(yearIndex, year) {
				$.each(monthEnum,
				function(monthName, monthVal) {
				 var dateElements = xmlDoc.getElementsByTagName('mon');
				 var monthFound = false;
				 $.each(dateElements,
						function(dateIndex,dateNode)
						{ var date = getNodeValue(dateNode);
					      if (date == monthVal && getYearForMonth(dateNode) == year) {
							 monthFound = true;
							 return false;
							 }
						});
				 if (!monthFound) {return;}
				 for (var r = 0; r < 2; r++) { // r = 0:directed, 1:non directed.
					 var isDirected = (r == 0);
					 var ioiExposedVenues = getDetailData(isDirected, monthVal, year);
					 var ioiExpsdVenuesArr = []; // holds tagged rows, if any.
					 var temp = [];
					 var hasIoIExposedVenues = ioiExposedVenues.length > 0;
					 if (hasIoIExposedVenues) {
						 temp.push({text: 'Venues', style: 'tableHeader', unbreakable:true, tags: ['Table','TR','TH','/TH','/TR']});
						 ioiExpsdVenuesArr.push(temp);
						 for (index = 0; index < ioiExposedVenues.length; index++) {
							 temp = [];
							 temp.push({text: ioiExposedVenues[index], style: 'tableNameValue', unbreakable:true, tags: ['TR','TD','/TD','/TR']});
							 ioiExpsdVenuesArr.push(temp);
						 }
					 }
					content.push(// Month Header
								 {text: monthName + WS + year + ' - ' + ((isDirected) ? 'Directed ' : 'Non-directed ') + 'Orders', style: 'sectionHeader', unbreakable:true, tags: ['H2']},
								  // Horizontal Line
								  {canvas : [ {type : 'line',x1 : 0,y1 : 5, x2 : 762, y2 : 5, lineWidth : 1 } ] },
								 // Summary
								  {text: 'Summary', style: 'subSectionHeader', unbreakable:true, tags: ['Caption','/Caption'] },
								  {table: {headerRows : 1,
									  		widths : [AUTO,AUTO,AUTO ],
									  		body : getSummaryData(isDirected,monthVal,year)
								  			},
								  	},
								 // IOI exposed Venues
								  ((hasIoIExposedVenues) ? {
									  text: 'Actionable IOI Exposed Venues', 
									  style: 'subSectionHeader', 
									  unbreakable:true, tags: ['Caption','/Caption']} 
								  : NS),
								  ((hasIoIExposedVenues) ? {
									  table: { body : ioiExpsdVenuesArr,
										  		headerRows : 1, widths : [ AUTO ]}} 
								  : NS),
								// Non-IOI exposed Venues Header
								  ((detailData.length > 1) ? { text: 'Order Routing Venues',
												              style: 'subSectionHeader', unbreakable:true,
												              tags: (hasIoIExposedVenues?['/Table']:[]).concat(['Caption','/Caption']) } : NS),
								  ((detailData.length > 1) ? { table: { body : detailData,
									  									headerRows : 1,
									  								    widths : [ 40,
																				AUTO, AUTO, AUTO, AUTO, AUTO,
																				AUTO, AUTO, AUTO, AUTO, AUTO,
																				AUTO, AUTO, AUTO, AUTO, AUTO,
																				AUTO, AUTO, AUTO, AUTO, AUTO,
																				AUTO ] // 22 columns
																		 } } : NS))}})});

	var docDefinition = { /* b3 */
		info: {title : title},
		displayDocTitle: true,
		lang: 'en-US', 
		marked: true,
		tabs: 'S',
		pageOrientation : 'landscape',
		compress : COMPRESS,
		content : content,
		styles : { /* only vertical-align: top is supported */
			header : {fontSize : 16, bold : true, alignment : 'center'},
			header3 : {fontSize : 10, bold : true, alignment : 'center', lineHeight: 1.2
			}, header4 : {fontSize : 8, bold : true, alignment : 'center', lineHeight: 1.2
			}, sectionHeader : {fontSize : 12, bold : true, alignment : 'left', lineHeight: 1.2
			}, majorSubSectionHeader : {fontSize : 11, bold : true, alignment : 'left', lineHeight: 1.2
			}, subSectionHeader : {fontSize : 9, bold : true, alignment : 'left', lineHeight: 1.2
			}, textStyle : {fontSize : 8
			}, tableHeader : {fontSize : 3.5, bold : true, alignment : 'center', fillColor : FILLCOLOR
			}, tableValue : {fontSize : 4, alignment : 'right'
			}, tableNameValue : {fontSize : 4, alignment : 'left'
			}, greyedOut : {fillColor : GRAYCOLOR}
		}
	};
	pdfMake.createPdf(docDefinition).download(outname + '.pdf');
}

function getSummaryHeader() { /* b3 */
	var row = [];
	for (var i = 0; i < b3SummaryTableHeaders.length; i++) {
		var summaryTableHeader = b3SummaryTableHeaders[i];
		verified(summaryTableHeader);
		isFirst = (i==0);
		isLast = (i==(b3SummaryTableHeaders.length - 1));
		row.push({
			text: summaryTableHeader,
			style: 'tableHeader', unbreakable:true,
			tags: (isFirst?['Table','TR']:[]).concat(['TH','/TH']).concat(isLast?['/TR']:[])
		});
	}
	return row;
}

function getDetailedHeader() { /* b3 */
	var row = [];
	for (var i = 0; i < b3DetailTableHeaders.length; i++) {
		var detailTableHeader = b3DetailTableHeaders[i];
		verified(detailTableHeader);
		isFirst = (i==0);
		isLast = (i==(b3DetailTableHeaders.length - 1));
		row.push({
			text: detailTableHeader,
			style: 'tableHeader', unbreakable:true,
			tags: ((isFirst)?['Table','TR']:[])
					.concat(['TH','/TH'])
					.concat((isLast)?['/TR']:[]) // close row
		});
	}
	return row;
}

function getSummaryData(directed, month, year) { /* b3 */
	var root = xmlDoc.getElementsByTagName((directed) ? 'hDirected' : 'hNondirected');
	var dataRows = [];
	dataRows.push(getSummaryHeader());
	if (root.length != 0) {
		var monthlyAllVenues = root[0].getElementsByTagName('mon');
		for (var i = 0; i < monthlyAllVenues.length; i++) {
			var node = monthlyAllVenues[i];
			if (getNodeValue(node) != month || getYearForMonth(node) != year) {
				continue;
			}
			var siblings = getNextSiblings(node);
			var row = [];
			for (l = 0; l < b3SummaryTableTags.length; l++) {
				var isFirst = (l==0);
				var isLast = (l==(b3SummaryTableTags.length - 1));
				var summaryTableTag = b3SummaryTableTags[l];
				for (m = 0; m < siblings.length; m++) {
					var sibling = siblings[m];
					if (sibling.tagName == summaryTableTag) {
						var nodeVal = getNodeValue(sibling);
						verified(nodeVal);
						row.push({
							text: nodeVal,
							style: TABLEVALUE, unbreakable:true,
							tags: (isFirst?['TR']:[])
									.concat(['TD','/TD'])
									.concat(isLast?['/TR','/Table']:[])
						});
						break;
					}
				}
			}
			if (row.length > 0) {
				dataRows.push(row);
			}
		}
	}
	return dataRows;
}

function getDetailData(isDirected, month, year) { /* b3 */
	var dataRows = [];
	var ioiExpsdVenues = [];
	var pushedHeader = false;
	var root = xmlDoc.getElementsByTagName((isDirected) ? 'hDirected' : 'hNondirected');
	dataRows.push(getDetailedHeader());
	if (root.length != 0) {
		var hMonthlyElts = root[0].getElementsByTagName('hMonthly');
		for (var i = 0; i < hMonthlyElts.length; i++) {
			var hMonthly = hMonthlyElts[i];
			var mon = hMonthly.getElementsByTagName('mon')[0];
			var yr = hMonthly.getElementsByTagName('year')[0];
			if (mon.textContent == month && yr.textContent == year) {
				var ioiExposedVenueListElts = hMonthly
						.getElementsByTagName('ioiExposedVenueList');
				for (var j = 0; j < ioiExposedVenueListElts.length; j++) {
					var ioiExposedVenueElts = ioiExposedVenueListElts[j]
							.getElementsByTagName('ioiExposedVenue');
					for (var k = 0; k < ioiExposedVenueElts.length; k++) {
						var ioiExposedVenueElt = ioiExposedVenueElts[k];
						var venueName = ioiExposedVenueElt.children[0].textContent;
						venueName = venueName.replace(/\s+/g, WS).trim();
						ioiExpsdVenues.push(venueName);
					}
				}
				var routingVenueListElts = hMonthly.getElementsByTagName('routingVenueList');
				for (var j = 0; j < routingVenueListElts.length; j++) {
					var routingVenueListElt = routingVenueListElts[j];
					var routingVenueElts = routingVenueListElt
							.getElementsByTagName('iVenue');
					for (var k = 0; k < routingVenueElts.length; k++) {
						var routingVenueElt = routingVenueElts[k];
						var venueChildElts = routingVenueElt.children;
						var netRow = [];
						var nodeVal = null;
						var isLastVenue = (k == (routingVenueElts.length - 1));
						var venueNameVal = getVenueName(routingVenueElt);
						netRow.push({text: venueNameVal, style: 'tableNameValue', unbreakable:true, tags: ['TR','TD','/TD']});
						b3DetailTableTags.forEach(
								function (tag, j) {
									var isLastCol = (j == (b3DetailTableTags.length - 1));
									nodeVal = WS;
									$.each(venueChildElts,function(index,elt) {
										if (elt.tagName == tag) {
											nodeVal = getNodeValue(elt, true);
											verified(nodeVal, 'nodeVal');
											return true;
										};
									});
									var n = {text: ((nodeVal==NS)?WS:nodeVal),
											style: TABLEVALUE, unbreakable:true,
											tags: ['TD','/TD']
												.concat(isLastCol?['/TR']:[])
												.concat((isLastCol && isLastVenue)?['/Table','/H2']:[])};
									netRow.push(n);
								});
						dataRows.push(netRow);
					} // routingVenueElts
				} // routingVenueListElts
			} // monthlyElts
		}
	};
	/* detailData is global */
	detailData = dataRows;
	return ioiExpsdVenues;
}

/****** a1 ******/

function createHeldOrderRoutingPublicReportPDF() { /* a1 */
	var outname = ((basename == null) ? '606a1_HeldOrderRoutingPublicReport' : removeExtension(basename.name));
	var title = 'Held NMS Stocks and Options Order Routing Public Report';
	var content = [];
	content.push({	text: getElementValue('bd') + ' - ' + title,
					tags: ['H','/H'],
					style: 'header',
					unbreakable:true
					}, ((hasTimeStamp) ? {
							text: 'Generated on ' + formatDate(getElementValue('timestamp')),
							tags: ['H1','/H1'],
							style: 'header4', unbreakable:true
					} : NS),
					NL,
					{	text: getQuarter(getElementValue('qtr')) + ', ' + getElementValue('year'),
						tags: ['H2','/H2'],
						style: 'header3', unbreakable:true
					},
					NL);
	var years = getAllYears();

	$.each(years, function(yearIndex, year) {
		$.each(monthEnum, function(monthName, monthVal) {
			var dateElements = xmlDoc.getElementsByTagName('mon');
			var monthFound = false;
			$.each(dateElements, function(dateIndex, dateNode) {
				if (getNodeValue(dateNode) == monthVal
						&& getYearForMonth(dateNode) == year) {
					monthFound = true;
					return false;
				}
			});

			if (!monthFound) {
				return;
			} else {
				content.push(a1body(0, monthVal, monthName, year));
				content.push(
				[ {
					canvas : [ { /* horizontal dashed line */
						type : 'line',x1 : 0,y1 : 5,x2 : 595 - 2 * 40,y2 : 5,dash : {length : 5},lineWidth : 1
					} ]
				} ]);
				content.push(a1body(1, monthVal, monthName, year));
				content.push(
				[ { /* horizontal dashed line */
					canvas : [ { type : 'line', x1 : 0, y1 : 5, x2 : 595 - 2 * 40, y2 : 5, dash : {length : 5}, lineWidth : 1
					} ]
				} ]);
				content.push(a1body(2, monthVal, monthName, year));
			}
		});
	});
	var docDefinition = { /* a1 */
		info: {title : title
				,PageLayout: 'OneColumn'
					},
		displayDocTitle: true,
		lang: 'en-US',
		marked: true,
		tabs: 'S',
		compress : COMPRESS,
		pageOrientation : 'landscape',
		content : content,
		styles : {
			header : { fontSize : 16, bold : true, alignment : 'center' },
			header3 : { fontSize : 10, bold : true, alignment : 'center', lineHeight: 1.2 },
			header4 : { fontSize : 8, bold : true, alignment : 'center', lineHeight: 1.2 },
			sectionHeader : { fontSize : 12, bold : true, alignment : 'left', lineHeight: 1.2 },
			subSectionHeader : { fontSize : 8, bold : true, alignment : 'left', lineHeight: 1.2 },
			textStyle : { fontSize : 6 },
			tableHeader : { fontSize : 6, bold : true, alignment : 'center', fillColor : FILLCOLOR },
			tableValue : { fontSize : 6, alignment : 'right' },
			tableNameValue : { fontSize : 6, alignment : 'center' },
			tableOrderTypVal : { fontSize : 6, alignment : 'left' }
		}
	};
	const pdf = pdfMake.createPdf(docDefinition);
	pdf.download(outname + '.pdf');
}



function getElementValueByMonth(name, parentName, month, year) { /* a1 */
	var val = NS;
	var x = xmlDoc.getElementsByTagName(name);
	for (var i = 0; i < x.length; i++) {
		var node = x[i];
		var parentNodes = getParents(node);
		for (var j = 0; j < parentNodes.length; j++) {
			if (parentNodes[j].tagName == parentName) {
				var siblings = getPreviousSiblings(parentNodes[j]);
				for (var k = 0; k < siblings.length; k++) {
					if (siblings[k].tagName == 'mon') {
						if (getNodeValue(siblings[k]) == month
								&& getYearForMonth(siblings[k]) == year) {
							return getNodeValue(node);
						}
					}
				}
			}
		}
	}
	return val;
}

function getVenuesByMonth(month, year, securityType) { /* a1 */
	var netRows = [];
	matrAspectsArr = [];
	var name = 'mon';
	var parentName = 'rVenue';
	var venueName, code, materialAspects;
	var x = xmlDoc.getElementsByTagName(name);
	for (var i = 0; i < x.length; i++) {
		var node = x[i];
		if (getNodeValue(node) != month || getYearForMonth(node) != year) {
			continue;
		}
		var siblingNodes = getNextSiblings(node);
		for (var j = 0; j < siblingNodes.length; j++) {
			if (siblingNodes[j].tagName != securityType) continue;
			var childNodes = siblingNodes[j].children;
			for (var k = 0; k < childNodes.length; k++) {
				if (childNodes[k].tagName != 'rVenues') continue;
				var venues = childNodes[k].children;
				var row = [];
				a1VenueTableHeaders.forEach(function(val,index) {
					var isFirstCol = (index==0);
					var isLastCol = (index==(a1VenueTableHeaders.length - 1));
					row.push({
						text: val,
						style: 'tableHeader', unbreakable:true,
						tags: ((isFirstCol)?['Table','TR']:[])
								.concat(['TH','/TH'])
								.concat((isLastCol)?['/TR']:[])
								.concat((isLastCol && venues.length==0)?['/Table']:[])});
				});
				netRows.push(row);
				var isFirstMa = true;
				for (var l = 0; l < venues.length; l++) {
					var isLastRow = (l == (venues.length - 1));
					var row = [];
					var venueElt = venues[l];
					if (!venueElt.tagName == 'rVenue') continue;
					var venueName = getVenueName(venueElt);
					row.push({tags: ['TR','TD','/TD'], text: venueName, style: 'tableNameValue', unbreakable:true});
					var venueChildNodes = venueElt.children;
					a1VenueTableTags.concat(['materialAspects']).forEach(
						function (tag,index) {
							var isLastCol = (index==(a1VenueTableTags.length - 1));
							var nodeVal = WS;
							$.each(venueChildNodes,
									function (index,elt) {
								if (elt.tagName == tag) {
									nodeVal = getNodeValue(elt);
									if (tag != 'materialAspects') {
										row.push({
											text: ((nodeVal==NS)?WS:nodeVal),
											tags: ['TD','/TD']
											.concat((isLastCol)?['/TR']:[])
											.concat((isLastCol && isLastRow)?['/Table']:[]),
											style: TABLEVALUE, unbreakable:true});
									} else if (nodeVal != NS) {
										matrAspectsArr.push({text: venueName + ':', style: TEXTSTYLE, unbreakable:true, tags: ((isFirstMa)?['L']:[]).concat(['LI','Lbl','/Lbl'])});
										matrAspectsArr.push({text: nodeVal + '\n\n', style: TEXTSTYLE, unbreakable:true, tags: ['LBody','/LBody','/LI']});
										isFirstMa = false;
									} // if
								} // if
							}) // each
						}); // function
					netRows.push(row);
					} // for l
				} // for k
			} // for j
		} // for i
	return netRows;
}

function getPublicRoutingBody(section, monthVal, year) { // a1
    var empty = true;
    for (var i=0;i<a1SummaryTableTags[i];i++) {
    	if (NS != getElementValueByMonth(a1SummaryTableTags[i],section, monthVal, year)) {
    		empty = false;
    		break;
    	}
    }
	var hdr = [
		{text: a1SummaryTableHeaders[0], tags: ['Table','TR','TH','/TH'], style: 'tableHeader', unbreakable:true},
		{text: a1SummaryTableHeaders[1], tags: ['TH','/TH'], style: 'tableHeader', unbreakable:true},
		{text: a1SummaryTableHeaders[2], tags: ['TH','/TH'], style: 'tableHeader', unbreakable:true},
		{text: a1SummaryTableHeaders[3], tags: ['TH','/TH'], style: 'tableHeader', unbreakable:true},
		{text: a1SummaryTableHeaders[4], tags: ['TH','/TH','/TR'], style: 'tableHeader', unbreakable:true},
		 ];
	var row =  [
		{text: (empty)?'-':getElementValueByMonth(a1SummaryTableTags[0],section, monthVal, year), tags: ['TR','TD','/TD'], style: TABLEVALUE},
		{text: (empty)?'-':getElementValueByMonth(a1SummaryTableTags[1],section, monthVal, year), tags: ['TD','/TD'], style: TABLEVALUE},
		{text: (empty)?'-':getElementValueByMonth(a1SummaryTableTags[2],section, monthVal, year), tags: ['TD','/TD'], style: TABLEVALUE},
		{text: (empty)?'-':getElementValueByMonth(a1SummaryTableTags[3],section, monthVal, year), tags: ['TD','/TD'], style: TABLEVALUE},
		{text: (empty)?'-':getElementValueByMonth(a1SummaryTableTags[4],section, monthVal, year), tags: ['TD','/TD','/TR','/Table'], style: TABLEVALUE},
		 ];
	return [hdr,row];
}

function a1body(n, monthVal, monthName, year) { /* a1 */
	var sectionText = a1SectionHeaders[n];
	var section = a1SectionTags[n];
	return [
			NL,
			// Month Header
			{	text: monthName + WS + year,
				tags: ['H3'],
				style: 'sectionHeader', unbreakable:true
			},
			{
				canvas : [ { type : 'line', 	x1 : 0, y1 : 5, x2 : 595 - 2 * 40, 	y2 : 5, lineWidth : 1 } ]
			},
			NL,
			{	text: sectionText,
				tags: ['H4','/H4','/H3'],
				fontSize : 10,
				bold : true,
				alignment : 'left'
			},
			// NMS Stock Header
			{	text: 'Summary',
				tags: ['Caption','/Caption'],
				style: 'subSectionHeader', unbreakable:true
			},
			{	table: { body : getPublicRoutingBody(section, monthVal, year),
					headerRows : 1,
					widths : [ 60, 60, 60, 60, 60 ]

				}
			},
			// Venues Header
			{ 	text: 'Venues',
				tags: ['Caption','/Caption'],
				style: 'subSectionHeader', unbreakable:true
			},
			{	table: { body : getVenuesByMonth(monthVal, year, section),
						headerRows : 1,
						dontBreakRows : true,
						widths : [ AUTO, AUTO, AUTO, AUTO, AUTO, AUTO, AUTO, AUTO,
									AUTO, AUTO, AUTO, AUTO, AUTO, AUTO ] /* 14 columns */
				}
			},
			NL,
			{	text: 'Material Aspects:',
				tags: ['Caption','/Caption'],
				style: 'subSectionHeader', unbreakable:true
			}, matrAspectsArr
			,{  text: NL,
				tags: ((matrAspectsArr.length > 0)?['/L']:[]),
				style: TEXTSTYLE, unbreakable:true }
			]
}


function getQuarter(num) { /* a1 */
	var quarterVal = NS;
	if (num == 1) {
		quarterVal = '1st Quarter';
	} else if (num == 2) {
		quarterVal = '2nd Quarter';
	} else if (num == 3) {
		quarterVal = '3rd Quarter';
	} else if (num == 4) {
		quarterVal = '4th Quarter';
	}
	return quarterVal;
}


/***** a1 and b3 *****/

function getAllYears() { /* a1 and b3 */
	var years = xmlDoc.getElementsByTagName('year');
	var yearArray = [];
	$.each(years, function(yearIndex, yearNode) {
		var year = getNodeValue(yearNode, true);
		if (yearArray.indexOf(year) < 0) {
			yearArray.push(year)
		}
	});
	return yearArray.sort();
}

function getYearForMonth(month) { /* a1 and b3 */
	var year;
	var siblings = getPreviousSiblings(month);
	$.each(siblings, function(index, node) {
		if (node.tagName == 'year') {
			year = getNodeValue(node, true);
			return false;
		}
	});
	return year;
}

function getVenueName(venueElt) {
	/* both a1 and b3 - specially concatenate two or four columns to one value */
	var venueChildNodes = venueElt.children;
	var venueNameVal = NS; //
	['venueName','name','services','mic','mpid'].forEach(
			function (tag) {
				var nodeVal = NS;
				$.each(venueChildNodes,function(index,elt) {
					if (elt.tagName == tag) {
						nodeVal = getNodeValue(elt, true);
						verified(nodeVal, 'nodeVal');
						nodeVal = nodeVal.replace(/\s+/g, WS).trim();
						return true;
					}
				});
				switch (tag) {
				case 'venueName':
				case 'name':
					venueNameVal += nodeVal; break;
				case 'services':
				case 'mic':
				case 'mpid':
					if (nodeVal.length > 0) {
						venueNameVal += ' (' + nodeVal +')';
						venueNameVal = venueNameVal.trim();
					}
					break;
				} // switch
			}); // function
    return venueNameVal;
}

/****** a1, b1 and b3 ******/

function formatDate(timestamp) {
	var date = new Date(timestamp);
	return date.toString();
}

function getPreviousSiblings(node) {
	var siblings = [];
	while (node != null && node.nodeType === Node.ELEMENT_NODE && node !== this) {
		siblings.push(node);
		node = node.previousElementSibling;
	}
	return siblings;
}

function getNextSiblings(node) {
	var siblings = [];
	while (node != null && node.nodeType === Node.ELEMENT_NODE && node !== this) {
		siblings.push(node);
		node = node.nextElementSibling;
	}
	return siblings;
}

function getParents(node) {
	var parents = [];
	while (node != null && node.nodeType === Node.ELEMENT_NODE && node !== this) {
		parents.push(node);
		node = node.parentNode;
	}
	return parents;
}

function getElementValue(name) {
	var x = xmlDoc.getElementsByTagName(name)[0];
	var y = x.childNodes[0];
	return y.nodeValue;
}

function getNodeValue(node, skipCommas) {
	if (skipCommas == null) {
		skipCommas = false;
	}
	var val = NS;
	if (node.childNodes[0] != null) {
		val = node.childNodes[0].nodeValue;
	}
	if (!skipCommas) {
		val = addCommas(val);
	}
	return val;
}

function getRoundedValue(val) {
	var rndVal = NS;
	rndVal = (Math.round((Number(val) + 0.00001) * 100) / 100).toString();
	return rndVal;
}

function removeExtension(filename){
	var lastDotPosition = filename.lastIndexOf('.');
	if (lastDotPosition === -1) return filename;
	else return filename.substr(0, lastDotPosition);
}

function loadXML() {
	var oFiles = document.getElementById('xmlFile').files;
	var isValid;
	try {
		var reader = new FileReader();
		basename = oFiles[0];
		reader.readAsText(oFiles[0]);
	} catch (err) {
		alert(err);
	}
	reader.onloadend = function() {
		try {
			if (xsdContent != null) {
				isValid = validateXMLContent(reader.result, oFiles[0].name);
			}
			if (isValid) {
				if (window.DOMParser) {
					var parser = new DOMParser();
					xmlDoc = $.parseXML(reader.result);
				} else if (window.ActiveXObject) {
					xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
					xmlDoc.async = false;
					xmlDoc.loadXML(reader.result);
				}
				if (xmlDoc.getElementsByTagName('timestamp')[0] != null) {
					hasTimeStamp = true;
				}
				if (xmlDoc.getElementsByTagName('notHeldOrderHandlingCustomerReport')[0] != null) {
					/* b3 */
					createNotHeldOrderHandlingCustomerReportPDF({});
				} else if (xmlDoc.getElementsByTagName('heldOrderRoutingPublicReport')[0] != null) {
					// a1
					createHeldOrderRoutingPublicReportPDF();
				} else if (xmlDoc.getElementsByTagName('heldExemptNotHeldOrderRoutingCustomerReport')[0] != null) {
					// b1
					createHeldExemptNotHeldOrderRoutingCustomerReport();
				} else {
					alert('NO MATCH');
				}
			}
			document.getElementById('rule606Form').reset();
		} catch (err) {
			alert(err);
		}
	}
}

function validateXMLContent(xmlContent, xmlFileName) {
	var isValid = true;
	var Module = {
		xml : xmlContent,
		schema : xsdContent,
		arguments : [ '--noout', '--schema', 'oh-20160630.xsd', xmlFileName ]
	};
	var validationMessage = validateXML(Module);
	if (validationMessage.indexOf('fails') >= 0) {
		isValid = false;
		alert(validationMessage);
	}
	return isValid;
}

function loadXSD() {
	var oFiles = document.getElementById('xsdFile').files;
	try {
		var reader = new FileReader();
		reader.readAsText(oFiles[0]);
		reader.onloadend = function() {xsdContent = reader.result;};
	} catch (err) {
		alert(err);
	}
}

function addCommas(number) {
	var x = number.split('.');
	var y = x[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
	if (x[1] != null) {
		y = y + '.' + x[1];
	}
	return y;
}

function verified(value, name) {
	if (typeof value == 'undefined') {
		throw new Error(((name == null) ? 'value ' : name) + 'Undefined');
	}
	return value;
}

/**** memory metering ****/

var memoryMessages = [{used:0}];

function memoryStatInitialize() {
	memoryMessages = [{used:0}];
}

function memoryStat(msg,popup) {
	if (window.performance == undefined || window.performance.memory == undefined) return;
	var memory = window.performance.memory;
	var used = Math.round(memory.usedJSHeapSize/(1024*1024));
	var total = Math.round(memory.totalJSHeapSize/(1024*1024));
	var previous = memoryMessages[memoryMessages.length-1]
	var change = used - previous.used;
	var record = {msg:msg,used:used,total:total,change:change};
	memoryMessages.push(record);
	if (popup) {
		alert(JSON.stringify(record));
	}
}
