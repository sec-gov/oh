//Rule 606 Report Generator was created by staff of the U.S. Securities and Exchange Commission.
//Data and content created by government employees within the scope of their employment
//are not subject to domestic copyright protection. 17 U.S.C. 105.

var xsdContent, xmlDoc, matrAspectsArr, detailData;
var hasTimeStamp = false;

var a1SectionHeaders = [ "S&P 500 Stocks", "Non-S&P 500 Stocks", "Options" ];
var a1SectionTags = [ "rSP500", "rOtherStocks", "rOptions" ];

var a1SummaryTableHeaders = [ "Non-Directed Orders as % of All Orders",
		"Market Orders as % of Non-Directed Orders",
		"Marketable Limit Orders as % of Non-Directed Orders",
		"Non-Marketable Limit Orders as % of Non-Directed Orders",
		"Other Orders as % of Non-Directed Orders" ];
var a1SummaryTableTags = [ "ndoPct", "ndoMarketPct", "ndoMarketableLimitPct",
		"ndoNonmarketableLimitPct", "ndoOtherPct" ]

var a1VenueTableHeaders = [
		"Venue - \nNon-directed Order Flow",
		"Non-Directed Orders (%)",
		"Market Orders (%)",
		"Marketable Limit Orders (%)",
		"Non-Marketable Limit Orders (%)",
		"Other Orders (%)",
		"Net Payment Paid/Received for Market Orders(USD)",
		"Net Payment Paid/Received for Market Orders(cents per hundred shares)",
		"Net Payment Paid/Received for Marketable Limit Orders(USD)",
		"Net Payment Paid/Received for Marketable Limit Orders(cents per hundred shares)",
		"Net Payment Paid/Received for Non-Marketable Limit Orders(USD)",
		"Net Payment Paid/Received for Non-Marketable Limit Orders(cents per hundred shares)",
		"Net Payment Paid/Received for Other Orders(USD)",
		"Net Payment Paid/Received for Other Orders(cents per hundred shares)" ];
var a1VenueTableTags = [ "orderPct", "marketPct", "marketableLimitPct",
		"nonMarketableLimitPct", "otherPct", "netPmtPaidRecvMarketOrdersUsd",
		"netPmtPaidRecvMarketOrdersCph",
		"netPmtPaidRecvMarketableLimitOrdersUsd",
		"netPmtPaidRecvMarketableLimitOrdersCph",
		"netPmtPaidRecvNonMarketableLimitOrdersUsd",
		"netPmtPaidRecvNonMarketableLimitOrdersCph",
		"netPmtPaidRecvOtherOrdersUsd", "netPmtPaidRecvOtherOrdersCph" ];

var b1TableHeaders = [ "Order ID", "Type", "Venue", "Time of Transaction (UTC)" ];
var b1OrderTags = [ "orderId", "directed", "route" ];
var b1RouteTags = [ "venueName", "mic", "transaction" ]
var b1TransactionTags = [ "date", "time" ];

var b3SummaryTableHeaders = [ "Total Shares Sent to Broker/Dealer",
		"Total Number of Shares Executed as Principal",
		"Total Orders Exposed (Actionable IOI)" ];
var b3SummaryTableTags = [ "sentShr", "executedAsPrincipalShr", "ioiExposedOrd" ];

var b3DetailTableHeaders = [
		"Venue",
		"Total Shares Routed",
		"Total Shares Routed Marked IOC",
		"Total Shares Routed that were further Routable",
		"Average Order Size Routed",
		"Total Shares Executed",
		"Fill Rate",
		"Average Fill Size",
		"Average Net Execution Fee or (Rebate)",
		"Total Shares Executed at Midpoint",
		"Percentage of Shares Executed at Midpoint",
		"Total Shares Executed that were Priced at the Near Side",
		"Percentage of Total Shares Executed that were Priced at the Near Side",
		"Total Shares Executed that were Priced at the Far Side",
		"Percentage of Total Shares Executed that were Priced at the Far Side",
		"Total Number of Shares that Provided Liquidity",
		"Percentage of Executed Shares that Provided Liquidity",
		"Average Duration of Orders that Provided Liquidity (in msec)",
		"Average Net Execution Rebate (or Fee Paid) for Shares that Provided Liquidity",
		"Total Number of Shares that Removed Liquidity",
		"Percentage of Executed Shares that Removed Liquidity",
		"Average Net Execution Fee (or rebate received) for Shares that Removed Liquidity" ];

var b3DetailTableTags = [ "routedShr", "iocRoutedShr", "furtherRoutableShr",
		"orderSizeShr", "executedShr", "filledPct", "fillSizeShr",
		"netFeeOrRebateCph", "midpointShr", "midpointPct", "nearsideShr",
		"nearsidePct", "farsideShr", "farsidePct", "providedLiqudityShr",
		"providedLiquidityPct", "orderDurationMsec", "providedLiquidityNetCph",
		"removedLiquidityShr", "removedLiquidityPct", "removedLiquidityNetCph" ];

var monthEnum = {
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

const NS = "";
const NL = '\n';
const AUTO = 'auto';
const TEXTSTYLE = 'textStyle';
const TABLEVALUE = 'tableValue';
var basename = null;

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

function createHeldExemptNotHeldOrderRoutingCustomerReport() {
	memoryStatInitialize();
	var docStyles = {
		header : {
			fontSize : 16,
			bold : true,
			alignment : 'center'
		},
		header3 : {
			fontSize : 10,
			bold : true,
			alignment : 'center'
		},
		header4 : {
			fontSize : 8,
			bold : true,
			alignment : 'center'
		},
		sectionHeader : {
			fontSize : 12,
			bold : true,
			alignment : 'left'
		},
		subSectionHeader : {
			fontSize : 10,
			bold : true,
			alignment : 'left'
		},
		textStyle : {
			fontSize : 8
		},
		tableHeader : {
			fontSize : 9,
			bold : true,
			alignment : 'center',
			fillColor : '#CCE6FF'
		},
		tableValue : {
			fontSize : 8,
			alignment : 'left'
		},
		tableNameValue : {
			fontSize : 9,
			alignment : 'left'
		},
		failHeader: {
			fontSize: 9,
			bold: true,
			alignment : 'center',
			fillColor : '#FFCCE6'
		}
	}

	var roots = [ 
			[ 'held', "Held NMS Stocks" ],
			[ 'notHeldExempt', "Exempt Not-Held NMS stocks",  ],
			[ 'options', "Options Customer Routing Report" ] 
	];
	var outname = ((basename == null) ? '606b1_HeldExemptNotHeldOrderRoutingCustomerReport' : removeExtension(basename.name));
	var threshold = 500; // number of transactions in a single pdf report file, about 10 pages
	var truncate = true;
	var hasoutput = false;
	// memoryStat("After XML loaded",false);
	for (var i = 0; i < roots.length; i++) {
		var title = roots[i][1];
		var body = getprivateData(roots[i][0]);
		if (body.length == 0) {
			break;
		}
		var columnHeadings = body[0];
		var chunks = [];
		var chunk = [];
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
					var fail = "Unable to render more than "+threshold+" "+title+" transactions. Open larger 606(b)(1) XML files in a spreadsheet or other application."
					alert(fail);
					chunk.push([{colSpan:4,text:fail,style:"failHeader"}]);
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
			content.push({
				text : getElementValue("bd") + title,
				style : 'header'
			}, hasTimeStamp ? {
				text : [ {
					text : 'Generated on ',
					style : 'header3'
				}, {
					text : formatDate(getElementValue("timestamp")),
					style : TEXTSTYLE
				} ]
			} : NS, {
				text : [ {
					text : ' For ',
					style : 'header3'
				}, {
					text : getElementValue("customer"),
					style : TEXTSTYLE
				} ]
			}, {
				text : [
						{
							text : ' Reporting Period ',
							style : 'header3'
						},
						{
							text : getElementValue("startDate") + ' to '
									+ getElementValue("endDate"),
							style : TEXTSTYLE
						} ]
			});
			content.push(NL, {
				text : "Orders - " + title + (chunks.length > 1 ? " Part " + j : NS) + NL,
				style : 'sectionHeader'
			}, {
				table : {
					headerRows : 1,
					widths : [ AUTO, AUTO, AUTO, AUTO ],
					body : chunk
				}
			});
			chunks[j] = null;
			var dd = {
				content : content,
				title : title,
				Language : "English",
				styles : docStyles
			};
			var name = outname + "_section_" + (i+1) + ((j == 0) ? NS : "_file_" + (j+1));			
			const pdf = pdfMake.createPdf(dd);
			const filename = name + '.pdf';
			dd = null;
			pdf.download(name + '.pdf')
			// memoryStat("After generating "+filename,false);
		}
	}
	if (!hasoutput) {
		alert("No transactions in "+basename.name+", no output files.");
	}
}

function createNotHeldOrderHandlingCustomerReportPDF(opts) {
	var content = [];
	var outname = ((basename == null) ? '606b3_NotHeldOrderHandling' : removeExtension(basename.name));
	content.push(
	// Header
	{
		text : getElementValue("bd") + " - Not-Held NMS Stocks Order Handling Report\n",
		style : 'header'
	}, hasTimeStamp ? {
		text : [ {
			text : 'Generated on ',
			style : 'header4'
		}, {
			text : formatDate(getElementValue("timestamp")),
			style : TEXTSTYLE
		} ]
	} : NS,{
				text : [ {
					text : ' For ',
					style : 'header3'
				}, {
					text : getElementValue("customer"),
					style : TEXTSTYLE
				} ]
			}, {
				text : [
						{
							text : ' Reporting Period ',
							style : 'header3'
						},
						{
							text : getElementValue("startDate") + ' to '
									+ getElementValue("endDate"),
							style : TEXTSTYLE
						} ]
			});
	var years = getAllYears();

	$
			.each(
					years,
					function(yearIndex, year) {
						$
								.each(
										monthEnum,
										function(monthName, monthVal) {
											var dateElements = xmlDoc
													.getElementsByTagName("mon");
											var monthFound = false;
											$
													.each(
															dateElements,
															function(dateIndex,
																	dateNode) {
																var date = getNodeValue(dateNode);
																if (date == monthVal
																		&& getYearForMonth(dateNode) == year) {
																	monthFound = true;
																	return false;
																}
															});

											if (!monthFound) {
												return;
											}
											for (var r = 0; r < 2; r++) {
												var isDirected = (r == 0);

												var ioiExposedVenues = getDetailData(
														isDirected, monthVal,
														year);
												var ioiExpsdVenuesArr = [];
												var temp = [];
												if (ioiExposedVenues.length > 0) {
													temp.push({
														text : "Venues",
														style : 'tableHeader'
													});
													ioiExpsdVenuesArr
															.push(temp);
													for (index = 0; index < ioiExposedVenues.length; index++) {
														temp = [];
														temp
																.push({
																	text : ioiExposedVenues[index],
																	style : 'tableNameValue'
																});
														ioiExpsdVenuesArr
																.push(temp);
													}
												}
												var hasIoIExposedVenues = ioiExposedVenues.length > 0;
												content
														.push(
																{
																	text : NL
																},
																// Month Header
																{
																	text : monthName
																			+ " "
																			+ year,
																	style : 'sectionHeader'
																},
																// Horizontal Line
																{
																	canvas : [ {
																		type : 'line',
																		x1 : 0,
																		y1 : 5,
																		x2 : 762,
																		y2 : 5,
																		lineWidth : 1
																	} ]
																},
																" ",
																{
																	text : ((isDirected) ? "Directed "
																			: "Non-directed ")
																			+ "Orders\n",
																	style : 'majorSubSectionHeader'
																},
																" ",
																// Summary
																{
																	text : "Summary",
																	style : 'subSectionHeader'
																},
																{
																	table : {
																		headerRows : 1,
																		widths : [
																				AUTO,
																				AUTO,
																				AUTO ],
																		body : getSummaryData(
																				isDirected,
																				monthVal,
																				year)
																	}
																},
																" ",
																// IOI exposed Venues
																hasIoIExposedVenues ? {
																	text : "Actionable IOI Exposed Venues\n",
																	style : 'subSectionHeader'
																}
																		: NS,
																hasIoIExposedVenues ? {
																	table : {
																		headerRows : 1,
																		widths : [ AUTO ],
																		body : ioiExpsdVenuesArr
																	}
																}
																		: NS,
																" ",
																// Non-IOI exposed Venues Header
																(detailData.length > 1) ? {
																	text : "Order Routing Venues\n",
																	style : 'subSectionHeader'
																}
																		: NS,
																(detailData.length > 1) ? {
																	table : {
																		headerRows : 1,
																		widths : [
																				40,
																				AUTO,
																				AUTO,
																				AUTO,
																				AUTO,
																				AUTO,
																				AUTO,
																				AUTO,
																				AUTO,
																				AUTO,
																				AUTO,
																				AUTO,
																				AUTO,
																				AUTO,
																				AUTO,
																				AUTO,
																				AUTO,
																				AUTO,
																				AUTO,
																				AUTO,
																				AUTO,
																				AUTO ], // 22
																		body : detailData
																	}
																}
																		: NS,
																NS);
											}
										});
					});
	var docDefinition = { // createNotHeldOrderHandlingCustomerReportPDF
		// notHeldOrderHandling
		pageOrientation : 'landscape',
		content : content,
		title : getElementValue("bd") + " - Not-Held NMS Stocks Order Handling Report",
		language : 'English',
		styles : {
			header : {
				fontSize : 16,
				bold : true,
				alignment : 'center'
			},
			header3 : {
				fontSize : 10,
				bold : true,
				alignment : 'center'
			},
			header4 : {
				fontSize : 8,
				bold : true,
				alignment : 'center'
			},
			sectionHeader : {
				fontSize : 12,
				bold : true,
				alignment : 'left'
			},

			majorSubSectionHeader : {
				fontSize : 11,
				bold : true,
				alignment : 'left'
			},
			subSectionHeader : {
				fontSize : 9,
				bold : true,
				alignment : 'left'
			},
			textStyle : {
				fontSize : 8
			},
			tableHeader : {
				fontSize : 3.5,
				bold : true,
				alignment : 'center',
				fillColor : '#CCE6FF'
			},
			tableValue : {
				fontSize : 4,
				alignment : 'right'
			},
			tableNameValue : {
				fontSize : 4,
				alignment : 'left'
			},
			greyedOut : {
				fillColor : '#CCCCCC'
			}
		}
	};
	pdfMake.createPdf(docDefinition).download(outname + '.pdf');
}

function createHeldOrderRoutingPublicReportPDF() { // Held Order
	var outname = ((basename == null) ? '606a1_HeldOrderRoutingPublicReport' : removeExtension(basename.name));
	var content = [];
	content
			.push(
					{
						text : getElementValue("bd")
								+ " - Held NMS Stocks and Options Order Routing Public Report\n",
						style : 'header'
					}, hasTimeStamp ? {
						text : [ {
							text : 'Generated on ',
							style : 'header4'
						}, {
							text : formatDate(getElementValue("timestamp")),
							style : TEXTSTYLE
						} ]
					} : NS, NL,
					// Period
					{
						text : getQuarter(getElementValue("qtr")) + ", "
								+ getElementValue("year"),
						style : 'header3'
					}, " ");
	var years = getAllYears();

	$.each(years, function(yearIndex, year) {
		$.each(monthEnum, function(monthName, monthVal) {
			var dateElements = xmlDoc.getElementsByTagName("mon");
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
				content.push(dummy1(0, monthVal, monthName, year));
				content.push(
				// Horizontal Dashed Line
				[ {
					canvas : [ {
						type : 'line',
						x1 : 0,
						y1 : 5,
						x2 : 595 - 2 * 40,
						y2 : 5,
						dash : {
							length : 5
						},
						lineWidth : 1
					} ]
				} ]);
				content.push(dummy1(1, monthVal, monthName, year));
				content.push(
				// Horizontal Dashed Line
				[ {
					canvas : [ {
						type : 'line',
						x1 : 0,
						y1 : 5,
						x2 : 595 - 2 * 40,
						y2 : 5,
						dash : {
							length : 5
						},
						lineWidth : 1
					} ]
				} ]);
				content.push(dummy1(2, monthVal, monthName, year));
			}
		});
	});
	var docDefinition = { // createHeldOrderRoutingPublicReportPDF
		pageOrientation : 'landscape',
		content : content,
		title : getElementValue("bd")
		+ " - Held NMS Stocks and Options Order Routing Public Report",
		Language : "English",
		styles : {
			header : {
				fontSize : 16,
				bold : true,
				alignment : 'center'
			},
			header3 : {
				fontSize : 10,
				bold : true,
				alignment : 'center'
			},
			header4 : {
				fontSize : 8,
				bold : true,
				alignment : 'center'
			},
			sectionHeader : {
				fontSize : 12,
				bold : true,
				alignment : 'left'
			},
			subSectionHeader : {
				fontSize : 8,
				bold : true,
				alignment : 'left'
			},
			textStyle : {
				fontSize : 6
			},
			tableHeader : {
				fontSize : 6,
				bold : true,
				alignment : 'center',
				fillColor : '#CCE6FF'
			},
			tableValue : {
				fontSize : 6,
				alignment : 'right'
			},
			tableNameValue : {
				fontSize : 6,
				alignment : 'center'
			},
			tableOrderTypVal : {
				fontSize : 6,
				alignment : 'left'
			}
		}
	};
	pdfMake.createPdf(docDefinition).download(outname + '.pdf');
}

function getprivateData(orderType) {
	var orderlist = xmlDoc.getElementsByTagName(orderType);
	var orders = [];
	var rows = [];
	$.each(orderlist, function(index, val) {
		orders = val.getElementsByTagName("order");
		var row = [];

		$.each(b1TableHeaders, function(index, val) {
			row.push({
				text : val,
				style : 'tableHeader'
			});
		});
		rows.push(row);

		$.each(orders, function(orderIndex, order) {
			var routes = [];
			var type = NS;
			var orderId = NS;
			var orderChildNodes = order.childNodes;
			$.each(orderChildNodes, function(oChildIndex, oChild) {

				if (oChild.tagName == b1OrderTags[0]) {
					orderId = getNodeValue(oChild, true);
				} else if (oChild.tagName == b1OrderTags[1]) {
					if (getNodeValue(oChild) == "Y") {
						type = "Directed";
					} else {
						type = "Non-Directed";
					}
				} else if (oChild.tagName == b1OrderTags[2]) {
					routes.push(oChild);
				}
			});

			if (routes.length < 1) {
				row = [];
				row.push({
					text : orderId,
					style : TABLEVALUE
				});
				row.push({
					text : type,
					style : TABLEVALUE
				});
				row.push(NS);
				row.push(NS);
				rows.push(row);
			} else {
				var totalRowSpan = 0;
				$.each(routes, function(rtIndex, route) {
					var transactionCount = 0;
					$.each(route.childNodes, function(rtChildIndex, rtChild) {
						if (rtChild.tagName == b1RouteTags[2]) {
							transactionCount += 1;
						}
					});
					transactionCount = Math.max(1, transactionCount);
					totalRowSpan += transactionCount;
				});
				$.each(routes, function(rtIndex, route) {
					row = [];
					var venueName = NS;
					var mic = NS;
					if (rtIndex == 0) {
						row.push({
							rowSpan : totalRowSpan,
							text : orderId,
							style : TABLEVALUE
						});
						row.push({
							rowSpan : totalRowSpan,
							text : type,
							style : TABLEVALUE
						});
					} else { // unlike html, cells that are underneath a rowspan > 1 must be filled with NS.
						row.push(NS);
						row.push(NS);
					}

					var rtChildNodes = route.childNodes;
					var transactions = [];
					$.each(rtChildNodes, function(rtChildIndex, rtChild) {
						if (rtChild.tagName == b1RouteTags[0]) {
							venueName = getNodeValue(rtChild,true);
						} else if (rtChild.tagName == b1RouteTags[1]) {
							if (venueName != NS) {
								venueName = venueName + " ("
										+ getNodeValue(rtChild,true) + ")";
							} else {
								venueName = getNodeValue(rtChild,true);
							}
							;
						} else if (rtChild.tagName == b1RouteTags[2]) {
							transactions.push(rtChild);
						}
					});
					if (transactions.length == 0) {
						row.push({
							text : venueName,
							style : TABLEVALUE
						});
						row.push({
							text : "-",
							style : TABLEVALUE
						});
						rows.push(row);
					} else {
						row.push({
							rowSpan : transactions.length,
							text : venueName,
							style : TABLEVALUE
						});
						$.each(transactions, function(txIndex, transaction) {
							if (row.length == 0) {
								row.push(NS);
								row.push(NS);
								row.push(NS);
							}
							;
							row.push({
								text : getTransactionDate(transaction),
								style : TABLEVALUE
							});
							rows.push(row);
							row = [];
						});
					}
					;
				});
			}
		});
	});
	return rows;
}

function getTransactionDate(transaction) {
	var date = NS;
	$.each(transaction.childNodes, function(txChildIndex, txChild) {
		if (txChild.tagName == b1TransactionTags[0]) {
			date += getNodeValue(txChild, true);
		} else if (txChild.tagName == b1TransactionTags[1]) {
			date += " " + getNodeValue(txChild, true);
		}
	});
	return date;
}

function getAllYears() {
	var years = xmlDoc.getElementsByTagName("year");
	var yearArray = [];
	$.each(years, function(yearIndex, yearNode) {
		var year = getNodeValue(yearNode, true);
		if (yearArray.indexOf(year) < 0) {
			yearArray.push(year)
		}
	});
	return yearArray.sort();
}

function getYearForMonth(month) {
	var year;
	var siblings = getPreviousSiblings(month);
	$.each(siblings, function(index, node) {
		if (node.tagName == "year") {
			year = getNodeValue(node, true);
			return false;
		}
	});
	return year;
}

function getElementValueByMonth(name, parentName, month, year) {
	var val = NS;
	var x = xmlDoc.getElementsByTagName(name);
	for (var i = 0; i < x.length; i++) {
		var node = x[i];
		var parentNodes = getParents(node);
		for (var j = 0; j < parentNodes.length; j++) {
			if (parentNodes[j].tagName == parentName) {
				var siblings = getPreviousSiblings(parentNodes[j]);
				for (var k = 0; k < siblings.length; k++) {
					if (siblings[k].tagName == "mon") {
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

function getVenuesByMonth(month, year, securityType) {
	var netRows = [];
	matrAspectsArr = [];
	var name = "mon";
	var parentName = "rVenue";
	var venueName, code, materialAspects;
	var temp = [];
	$.each(a1VenueTableHeaders, function(index, val) {
		temp.push({
			text : val,
			style : 'tableHeader'
		});
	});
	netRows.push(temp);
	temp = [];

	var x = xmlDoc.getElementsByTagName(name);
	for (var i = 0; i < x.length; i++) {
		var node = x[i];
		if (getNodeValue(node) != month || getYearForMonth(node) != year) {
			continue;
		}

		var siblingNodes = getNextSiblings(node);
		for (var j = 0; j < siblingNodes.length; j++) {
			if (siblingNodes[j].tagName == securityType) {
				var childNodes = siblingNodes[j].childNodes;
				for (var k = 0; k < childNodes.length; k++) {
					if (childNodes[k].tagName == "rVenues") {
						var venues = childNodes[k].childNodes;
						for (var l = 0; l < venues.length; l++) {
							if (venues[l].tagName == "rVenue") {
								temp = [];
								var venueChildNodes = venues[l].childNodes;
								for (var m = 0; m < venueChildNodes.length; m++) {
									if (venueChildNodes[m].tagName == "name") {
										var hasMic = false;
										venueName = getNodeValue(venueChildNodes[m],true);
										var venueNameSiblings = getNextSiblings(venueChildNodes[m]);
										for (var p = 0; p < venueNameSiblings.length; p++) {
											if (venueNameSiblings[p].tagName == "mic") {
												hasMic = true;
												break;
											}
										}
										if (!hasMic) {
											temp.push({
												text : venueName,
												style : 'tableNameValue'
											});
										}
									} else if (venueChildNodes[m].tagName == "mic") {
										code = getNodeValue(venueChildNodes[m],true);
										if (venueName != null) {
											venueName = venueName + " (" + code
													+ ")";
										} else {
											venueName = code;
										}
										temp.push({
											text : venueName,
											style : 'tableNameValue'
										});
									} else if (venueChildNodes[m].tagName == "materialAspects") {
										materialAspects = getNodeValue(venueChildNodes[m],true);
										if (materialAspects != NS) {
											matrAspectsArr.push([
													{
														text : venueName + ":",
														style : TEXTSTYLE
													},
													{
														text : materialAspects
																+ "\n\n",
														style : TEXTSTYLE
													} ]);
										}
									} else {
										for (var n = 0; n < a1VenueTableTags.length; n++) {
											if (a1VenueTableTags[n] == venueChildNodes[m].tagName) {
												temp
														.push({
															text : getNodeValue(venueChildNodes[m]),
															style : 'tableNameValue'
														});
												break;
											}
										}
									}
								}
								netRows.push(temp);
							}
						}
					}
				}
			}
		}
	}
	return netRows;
}

function getPublicRoutingBody(section, monthVal, year) {
	return [
			[ {
				text : a1SummaryTableHeaders[0],
				style : 'tableHeader'
			}, {
				text : a1SummaryTableHeaders[1],
				style : 'tableHeader'
			}, {
				text : a1SummaryTableHeaders[2],
				style : 'tableHeader'
			}, {
				text : a1SummaryTableHeaders[3],
				style : 'tableHeader'
			}, {
				text : a1SummaryTableHeaders[4],
				style : 'tableHeader'
			} ],
			[
					{
						text : getElementValueByMonth(a1SummaryTableTags[0],
								section, monthVal, year),
						style : TABLEVALUE
					},
					{
						text : getElementValueByMonth(a1SummaryTableTags[1],
								section, monthVal, year),
						style : TABLEVALUE
					},
					{
						text : getElementValueByMonth(a1SummaryTableTags[2],
								section, monthVal, year),
						style : TABLEVALUE
					},
					{
						text : getElementValueByMonth(a1SummaryTableTags[3],
								section, monthVal, year),
						style : TABLEVALUE
					},
					{
						text : getElementValueByMonth(a1SummaryTableTags[4],
								section, monthVal, year),
						style : TABLEVALUE
					} ] ];
}

function dummy1(n, monthVal, monthName, year) {
	var sectionText = a1SectionHeaders[n];
	var section = a1SectionTags[n];
	return [
			{
				text : NL
			},
			// Month Header
			{
				text : monthName + " " + year,
				style : 'sectionHeader'
			},
			// Horizontal
			// Line
			{
				canvas : [ {
					type : 'line',
					x1 : 0,
					y1 : 5,
					x2 : 595 - 2 * 40,
					y2 : 5,
					lineWidth : 1
				} ]
			},
			" ",
			{
				text : sectionText,
				fontSize : 10,
				bold : true,
				alignment : 'left'
			},
			// NMS Stock Header
			{
				text : "\nSummary\n",
				style : 'subSectionHeader'
			},
			{
				table : {
					headerRows : 1,
					widths : [ 60, 60, 60, 60, 60 ],
					body : getPublicRoutingBody(section, monthVal, year)
				}
			},
			// Venues Header
			{
				text : "\nVenues\n",
				style : 'subSectionHeader'
			},
			{
				table : {
					headerRows : 1,
					widths : [ AUTO, AUTO, AUTO, AUTO, AUTO, AUTO, AUTO, AUTO,
							AUTO, AUTO, AUTO, AUTO, AUTO, AUTO ],
					body : getVenuesByMonth(monthVal, year, section)
				}
			}, " ",
			// Material
			// Aspects
			// Header
			{
				text : "Material Aspects:\n",
				style : 'subSectionHeader'
			}, matrAspectsArr ]
}

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

function getInstitutionalNodeValue(node) {
	var val = NS;
	var elmntChildNodes = [];
	var childNodes = node.childNodes;

	for (var z = 0; z < childNodes.length; z++) {
		if (childNodes[z].nodeType === Node.ELEMENT_NODE) {
			elmntChildNodes.push(childNodes[z]);
		}
	}

	if (elmntChildNodes != null) {
		$.each(elmntChildNodes, function(index, childNode) {
			if (false) {
				if (childNode.childNodes[0] != null) {
					val = childNode.childNodes[0].nodeValue;
				}
				val = addCommas(val);
				return false;
			}
		});
	}

	return val;
}

function getQuarter(num) {
	var quarterVal = NS;
	if (num == 1) {
		quarterVal = "1st Quarter";
	} else if (num == 2) {
		quarterVal = "2nd Quarter";
	} else if (num == 3) {
		quarterVal = "3rd Quarter";
	} else if (num == 4) {
		quarterVal = "4th Quarter";
	}
	return quarterVal;
}

function getRoundedValue(val) {
	var rndVal = NS;
	rndVal = (Math.round((Number(val) + 0.00001) * 100) / 100).toString();
	return rndVal;
}

function getSummaryHeader() {
	var row = [];
	for (var i = 0; i < b3SummaryTableHeaders.length; i++) {
		var summaryTableHeader = b3SummaryTableHeaders[i];
		verified(summaryTableHeader);
		row.push({
			text : summaryTableHeader,
			style : 'tableHeader'
		});
	}
	return row;
}

function getDetailedHeader(venue) {
	// venue arg is unused
	var row = [];
	for (var i = 0; i < b3DetailTableHeaders.length; i++) {
		var detailTableHeader = b3DetailTableHeaders[i];
		verified(detailTableHeader);
		row.push({
			text : detailTableHeader,
			style : 'tableHeader'
		});
	}
	return row;
}

function getSummaryData(directed, month, year) {
	var root = xmlDoc.getElementsByTagName((directed) ? "hDirected"
			: "hNondirected");
	var dataRows = [];
	dataRows.push(getSummaryHeader());
	if (root.length != 0) {
		var monthlyAllVenues = root[0].getElementsByTagName("mon");
		for (var i = 0; i < monthlyAllVenues.length; i++) {
			var node = monthlyAllVenues[i];
			if (getNodeValue(node) != month || getYearForMonth(node) != year) {
				continue;
			}
			var siblings = getNextSiblings(node);
			var row = [];
			for (l = 0; l < b3SummaryTableTags.length; l++) {
				var summaryTableTag = b3SummaryTableTags[l];
				for (m = 0; m < siblings.length; m++) {
					var sibling = siblings[m];
					if (sibling.tagName == summaryTableTag) {
						var nodeVal = getNodeValue(sibling);
						verified(nodeVal);
						row.push({
							text : nodeVal,
							style : TABLEVALUE
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

function getDetailData(isDirected, month, year) {

	var dataRows = [];
	var ioiExpsdVenues = [];
	var pushedHeader = false;
	var root = xmlDoc.getElementsByTagName((isDirected) ? "hDirected"
			: "hNondirected");
	dataRows.push(getDetailedHeader());
	if (root.length != 0) {
		var hMonthlyElts = root[0].getElementsByTagName("hMonthly");
		for (var i = 0; i < hMonthlyElts.length; i++) {
			var hMonthly = hMonthlyElts[i];
			var mon = hMonthly.getElementsByTagName('mon')[0];
			var yr = hMonthly.getElementsByTagName('year')[0];
			if (mon.textContent == month && yr.textContent == year) {
				var ioiExposedVenueListElts = hMonthly
						.getElementsByTagName("ioiExposedVenueList");
				for (var j = 0; j < ioiExposedVenueListElts.length; j++) {
					var ioiExposedVenueElts = ioiExposedVenueListElts[j]
							.getElementsByTagName('ioiExposedVenue');
					for (var k = 0; k < ioiExposedVenueElts.length; k++) {
						var ioiExposedVenueElt = ioiExposedVenueElts[k];
						var venueName = ioiExposedVenueElt.children[0].textContent;
						venueName = venueName.replace(/\s+/g, ' ').trim();
						ioiExpsdVenues.push(venueName);
					}
				}
				var routingVenueListElts = hMonthly
						.getElementsByTagName("routingVenueList");
				for (var j = 0; j < routingVenueListElts.length; j++) {
					var routingVenueListElt = routingVenueListElts[j];
					var routingVenueElts = routingVenueListElt
							.getElementsByTagName('iVenue');
					for (var k = 0; k < routingVenueElts.length; k++) {
						var routingVenueElt = routingVenueElts[k];
						var venueChildElts = routingVenueElt.children;
						var netRow = [];
						var venueNameVal = NS;
						var nameCell = false;
						for (var l = 0; l < venueChildElts.length; l++) {
							var node = venueChildElts[l];
							var tagName = node.tagName;
							var nodeVal = NS;
							if (tagName == "venueName") {
								nodeVal = getNodeValue(node, true);
								verified(nodeVal, 'nodeVal');
								nodeVal = nodeVal.replace(/\s+/g, ' ').trim();
								venueNameVal += nodeVal;
							} else if (tagName == "services") {
								nodeVal = getNodeValue(node, true);
								verified(nodeVal, 'nodeVal');
								nodeVal = nodeVal.replace(/\s+/g, ' ').trim();
								if (venueNameVal == NS) {
									venueNameVal = nodeVal;
								} else {
									venueNameVal += " (" + nodeVal + ")";
								}
							} else if ((tagName == "mic")
									|| (tagName == "mpid")) {
								nodeVal = getNodeValue(node, true);
								verified(nodeVal, 'nodeVal');
								nodeVal = nodeVal.replace(/\s+/g, ' ').trim();
								if (venueNameVal == NS) {
									venueNameVal = "(" + nodeVal + ")";
								} else {
									venueNameVal += " (" + nodeVal + ")";
								}
							} else {
								if (!nameCell) {
									netRow.push({
										text : venueNameVal,
										style : 'tableNameValue'
									});
									nameCell = true;
								}
								for (var m = 0; m < b3DetailTableTags.length; m++) {
									var detailTableTag = b3DetailTableTags[m];
									if (tagName == detailTableTag) {
										nodeVal = getNodeValue(node);
										verified(nodeVal, 'nodeVal');
										netRow.push({
											text : nodeVal,
											style : TABLEVALUE
										});
										break;
									}
								}
							}
						}
						;
						dataRows.push(netRow);
					}
				}
			}
		}
	}
	;
	detailData = dataRows;
	return ioiExpsdVenues;
}

function removeExtension(filename){
	var lastDotPosition = filename.lastIndexOf(".");
	if (lastDotPosition === -1) return filename;
	else return filename.substr(0, lastDotPosition);
}

function loadXML() {
	var oFiles = document.getElementById("xmlFile").files;
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
					xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
					xmlDoc.async = false;
					xmlDoc.loadXML(reader.result);
				}
				if (xmlDoc.getElementsByTagName("timestamp")[0] != null) {
					hasTimeStamp = true;
				}
				if (xmlDoc
						.getElementsByTagName("notHeldOrderHandlingCustomerReport")[0] != null) {
					// b3
					createNotHeldOrderHandlingCustomerReportPDF({});
				} else if (xmlDoc
						.getElementsByTagName("heldOrderRoutingPublicReport")[0] != null) {
					// a1
					createHeldOrderRoutingPublicReportPDF();
				} else if (xmlDoc
						.getElementsByTagName("heldExemptNotHeldOrderRoutingCustomerReport")[0] != null) {
					// b1
					createHeldExemptNotHeldOrderRoutingCustomerReport();
				} else {
					alert("NO MATCH");
				}
			}
			document.getElementById("rule606Form").reset();
		} catch (err) {
			alert(err);
		}
	};
}

function validateXMLContent(xmlContent, xmlFileName) {
	var isValid = true;
	var Module = {
		xml : xmlContent,
		schema : xsdContent,
		arguments : [ "--noout", "--schema", "oh-20160630.xsd", xmlFileName ]
	};

	var validationMessage = validateXML(Module);
	if (validationMessage.indexOf('fails') >= 0) {
		isValid = false;
		alert(validationMessage);
	}
	return isValid;
}

function loadXSD() {
	var oFiles = document.getElementById("xsdFile").files;
	try {
		var reader = new FileReader();
		reader.readAsText(oFiles[0]);

		reader.onloadend = function() {
			xsdContent = reader.result;
		};
	} catch (err) {
		alert(err);
	}
}

function addCommas(number) {
	var x = number.split('.');
	var y = x[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	if (x[1] != null) {
		y = y + '.' + x[1];
	}
	return y;
}

function verified(value, name) {
	if (typeof value == 'undefined') {
		throw new Error(((name == null) ? "value " : name) + "Undefined");
	}
	return value;
}