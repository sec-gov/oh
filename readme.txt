12/??/2020 update:
* Relax the pattern for MIC codes, to permit digits as well as uppercase letters.
* Add a footnote regarding the providedLiquidtyShr element to the technical guide.

10/27/2020 update:

* Correct bug which caused some text fields such as Venue names containing commas
  and periods to be truncated.
* Add missing customer and period information to the 606(b)(3) report header.

4/3/2020 update:
* for "PRV" brokers in samples/606b3_not_held_customer_handling, remove some numeric
  fields to illustrate that for the PRV business model the numbers are not required.

3/19/2020 update:
* relax the maximum length of venue, broker-dealer and customer names to 80 characters.
* relax the uniqueness constraint on venue name + mic combinations; now one venue name
  can have more than one MIC.
* alter the version element so that the new schema can continue to validate instances
  created using the previous schema version. 

2/26/2020 update:

* correct the documentation field of elements netFeeOrRebateCph, providedLiquidityNetCph 
  and removedLiquidityNetCph, so as to agree with the FAQ at
  https://www.sec.gov/tm/faq-rule-606-regulation-nms .  Schema validation
  is not affected, so the namespace and version remains the same.
  
* correct a bug in Rule606ReportGenerator.js causing truncation of Venue Names
  containing a "." anywhere other than as the last character.
---
12/4/2019 initial release

To use the Report Generator:
1. Extract the files in this zip archive to a folder.
2. Open file Rule606ReportGenerator.html in a browser.
3. If you see a message
"The browser mode you are running is not compatible with this application."
   Then please follow the suggestions in the rest of the message.
4. Click on the button "Browse to the XSD File..."
5. Browse to file oh-20191231.xsd in the "samples" folder and select it.
6. Click on the button "Browse to the XML File..."
7. Choose any one of the sample files, such as one of these three:
		606a1_held_order_public_report.xml
		606b1_held_exempt_not_held_customer_routing.xml
		606b3_not_held_customer_handling.xml
6. After a few moments, your browser should produce one or more pdf files and offer to
   save or open them.  606b1 reports are limited to 500 rows each.
7. Other sample .xml files vary the amount of data and period covered, to illustrate
   the effect on the .pdf output.
8. Any sample files you create on your own can also be loaded; so long as you
   have loaded the xsd file, it will report any syntax errors. 

If the application does not work at all inside your corporate IT environment,
it is most likely due to network or other security restrictions.  Please 
contact your IT department for assistance but do not attempt to circumvent 
their security measures without permission.

Suggestions directed to StructuredData@sec.gov regarding layout and content of 
the report are welcome. 
---
Created by staff of the U.S. Securities and Exchange Commission.
Data and content created by government employees within the scope of their employment
are not subject to domestic copyright protection. 17 U.S.C. 105.
