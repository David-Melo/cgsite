var string2Array = function(input){
    var string = String(input);
    var clean = string.replace(/\\"/g, '').replace(/"/g,'');
    var arr = clean.split(',');
    return (arr.length>1)?arr:arr[0];
}
var S = require('string');

module.exports = {

    makeListing: function(listing,model,full){

        console.log('makinglisting');

        var details = {
            id: listing.id,
            objectID: listing.field_sysid,
            model: model,
            code: null,
            finance: null,
            parent: null,
            proptype: null,
            sysid: listing.field_sysid,
            mls: listing.field_157,
            folio: listing.field_264,
            updated: listing.field_131,
            description: listing.field_214,
            price: parseFloat(listing.field_137),
            year: listing.field_314,
            full_address: listing.field_881 + ' ' + listing.field_922 + ', ' + listing.field_924 + ' ' + listing.field_10,
            address: listing.field_881,
            city: listing.field_922,
            state: listing.field_924,
            zip: listing.field_10,
            county: listing.field_61,
            office: listing.field_165
        }

        switch(model){

            case 'RE1':
                details.code = 'RE1';
                details.proptype = 'Single Family Home';
                details.finance = 'BUY';
                details.parent = 'RES';
                details.beds = parseInt(listing.field_25);
                details.baths = parseInt(listing.field_92);
                details.living_area = parseFloat(listing.field_261);
                details.cooling = string2Array(listing.field_57);
                details.lot_area = parseFloat(listing.field_232);
                details.pool = (listing.field_191=='Yes')? true:false;
                details.floors = string2Array(listing.field_96);
                details.additional_rooms = string2Array(listing.field_220);
                details.features = string2Array(listing.field_116);
                details.appliances = string2Array(listing.field_81);
                details.design = string2Array(listing.field_68);
                details.external_features = string2Array(listing.field_87);
                details.parking_type = string2Array(listing.field_177);
                details.parking_spaces = parseFloat(listing.field_102);
                details.lots = string2Array(listing.field_141);
                details.association = string2Array(listing.field_111);
                details.association_fee = parseFloat(listing.field_93);
                break;

            case 'RE2':
                details.code = 'RE2';
                details.proptype = 'Condo / Townhouse';
                details.finance = 'BUY';
                details.parent = 'RES';
                details.beds = listing.field_25;
                details.baths = listing.field_92;
                details.living_area = listing.field_261;
                details.cooling = string2Array(listing.field_57);
                details.type = string2Array(listing.field_372);
                details.security = string2Array(listing.field_364);
                details.amenities = string2Array(listing.field_319);
                details.association = string2Array(listing.field_111);
                details.association_fee = listing.field_93;
                break;

            case 'RNT':
                if(S(listing.field_588).contains('Single')){
                    details.code = 'RNT1';
                    details.proptype = 'Single Family Home';
                } else {
                    details.code = 'RNT2';
                    details.proptype = 'Condo / Townhouse';
                }
                details.finance = 'RNT';
                details.parent = 'RES';
                details.beds = listing.field_25;
                details.baths = listing.field_92;
                details.living_area = listing.field_25;
                details.cooling = string2Array(listing.field_57);
                details.features = string2Array(listing.field_116);
                details.rentperiod = listing.field_578;
                details.available = listing.field_562;
                details.furnished = listing.field_99;
                details.type = listing.field_588;
                details.minlease = listing.field_567;
                details.application_fee = listing.field_554;
                details.external_features = string2Array(listing.field_87);
                details.moveincost = listing.field_570;
                details.rentperiod = listing.field_578;
                break;

            case 'COM':
                if( S(listing.field_662).contains('Income Non-Waterfront') || S(listing.field_662).contains('Income Waterfront') || S(listing.field_662).contains('Efficiency') || S(listing.field_662).contains('Multifamily') || S(listing.field_662).contains('Townhouse') ){
                    details.code = 'COMB1';
                    details.proptype = 'Multifamily';
                    details.finance = 'BUY';

                } else if ( S(listing.field_662).contains('Commercial Office') ) {
                    details.code = 'COMB2';
                    details.proptype = 'Office';
                    details.finance = 'BUY';

                } else if ( S(listing.field_662).contains('Industrial') ) {
                    details.code = 'COMB3';
                    details.proptype = 'Industrial';
                    details.finance = 'BUY';

                } else if ( S(listing.field_662).contains('Retail') ){
                    details.code = 'COMB4';
                    details.proptype = 'Retail';
                    details.finance = 'BUY';

                } else if ( S(listing.field_662).contains('Hotel Waterfront') || S(listing.field_662).contains('Hotel Non-Waterfront') ){
                    details.code = 'COMB5';
                    details.proptype = 'Hotel & Motel';
                    details.finance = 'BUY';

                } else if ( S(listing.field_662).contains('Special Purpose') ){
                    details.code = 'COMB6';
                    details.proptype = 'Special Purpose';
                    details.finance = 'BUY';

                } else if ( S(listing.field_662).contains('Mixed Use') ){
                    details.code = 'COMB7';
                    details.proptype = 'Mixed Use';
                    details.finance = 'BUY';

                } else if ( S(listing.field_662).contains('Industrial Lease') ){
                    details.code = 'COMR1';
                    details.proptype = 'Industrial';
                    details.finance = 'RNT';

                } else if ( S(listing.field_662).contains('Commercial Lease') ){
                    details.code = 'COMR2';
                    details.proptype = 'Office/Retail';
                    details.finance = 'RNT';

                }
                details.parent = 'COM';
                details.type = string2Array(listing.field_594);
                break;

            case 'CLD':
                if(S(listing.field_544).contains('Agri')){
                    details.code = 'CLD2';
                    details.proptype = 'Agricultural';
                    details.finance = 'BUY';
                } else {
                    details.code = 'CLD1';
                    details.proptype = 'Land';
                    details.finance = 'BUY';
                }
                details.parent = 'COM';
                details.land_use = string2Array(listing.field_531);
                details.jurisdiction = listing.field_515;
                details.usage = string2Array(listing.field_545);
                details.acres = parseInt(listing.field_455);
                details.utilities = string2Array(listing.field_546);
                details.utilities_onsite = string2Array(listing.field_526);
                break;

            case 'RLD':
                details.code = 'RLD';
                details.parent = 'COM';
                details.proptype = 'Residential Land';
                details.finance = 'BUY';
                details.parcels = listing.field_477;
                break;

            case 'BUS':
                details.code = 'BUS';
                details.proptype = 'Business';
                details.finance = 'BUY';
                details.parent = 'COM';
                details.type = listing.field_748;
                details.license = string2Array(listing.field_732);
                details.yearsactive = listing.field_756;
                break;

            case 'RIN':
                details.code = 'RIN';
                details.proptype = 'Residential Income';
                details.finance = 'BUY';
                details.parent = 'COM';
                break;

        }

        if(full==true){
            _.assign(details,listing);
        }

        return details;

    }

};