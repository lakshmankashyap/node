$(function() {
	fetchAuctionDetails();
	changeAuctionStatus();
})

function fetchAuctionDetails() {
	var request = {};
	request.action = "fetchAuctionDetails";
	request.auction_sno = AUCTION_SNO;
	$.ajax({
		type	:	'POST',
		url		:	EndPoint,
		data	:	request
	}).done(function(response) {
		response = $.parseJSON(response);
		if (response.status == "success") {
			fillDetails(response.data)
			listAuctionBids();
		}
	});
}

function fillDetails(auction) {
	AUCTION_STATUS = auction.status;

	auctionDetails(auction);
	auctionStatusEvents(auction);
	$('.competetive-bid-opt').html('');
	if (auction.status == 1) {
		addCompetetiveBidOption()
	}
	fillBidValues(auction)
}

function auctionDetails(auction) {
	$('.auction_end_date_time').text(auction.auction_end_date_time);
	$('.road_show_start_date_time').text(auction.road_show_start_date_time);
	$('.auction_start_date_time').text(auction.auction_start_date_time);
	$('.cease_bid_cancellation_date_time').text(auction.cease_bid_cancellation_date_time);
	$('.number_for_sale').text(auction.number_for_sale);
	var auction_status = ["Waiting for Road Show", "Rodeshow Started","Auction Started","Auction Cancelled","Auction Completed","Auction Cancelled"]
	$('.auction-status').text(auction_status [auction.status]);
}

function fillBidValues(auction) {
	var html = '';
	$.each(auction.bids, function(i, bid) {
		html += '<span>'+bid+'</span>';
	})
	$('.bids-scale').html(html);

	if (auction.status > 1 && auction.status < 4) {
		$('.bids-scale span:eq('+auction.out_bid_position+')').addClass('active fa fa-long-arrow-down');
		var eq_pos = (auction.out_bid_position == 0)? '' : ':eq('+(auction.out_bid_position -1)+') ~ span ';
		$('.bids-scale span'+eq_pos).off('click');
		$('.bids-scale span'+eq_pos).on('click', function(event) {
			event.preventDefault();
			$("#place-bid-modal").modal("show");
			$('#place-bid-modal .value').val($(this).text()).show();
		});
	}
}

function addCompetetiveBidOption() {
	$('.competetive-bid-opt').html('<button class="btn btn-success btn-block place-competetive-bid">Place Non Competitive Bid</button>');
	placeCompetetiveBid();
}

function placeCompetetiveBid() {
	$('.place-competetive-bid').off('click');
	$('.place-competetive-bid').on('click', function(event) {
		event.preventDefault();
		$('#place-bid-modal .value').val(0);
		$("#place-bid-modal").modal("show");
	});
}

function auctionStatusEvents(auction) {
	$('.auction-action').addClass("disabled").attr("disabled" , true);
	$('.auction-action[data-action="cancel-auction"]').removeClass("disabled").attr("disabled" , false);
	switch (auction.status) {
		case "0":
			$('.auction-action[data-action="start-rodeshow"]').removeClass("disabled").attr("disabled" , false);
		break

		case "1":
			$('.auction-action[data-action="start-auction"]').removeClass("disabled").attr("disabled" , false);
		break

		case "2":
			$('.auction-action[data-action="cease-bid-cancellation"]').removeClass("disabled").attr("disabled" , false);
		break

		case "3":
			$('.auction-action[data-action="complete-auction"]').removeClass("disabled").attr("disabled" , false);
		break

		case "5":
			$('.auction-action[data-action="cancel-auction"]').addClass("disabled").attr("disabled" , true);
		break
	}
}


function changeAuctionStatus() {
	$(".auction-action").off("click");
	$(".auction-action").on("click", function(event) {
		event.preventDefault();
		var request = {};
		request.action = $(this).data("action");
		request.auction_sno = AUCTION_SNO;
		$.ajax({
			type	:	'POST',
			url		:	EndPoint,
			data	:	request
		}).done(function(response) {
			response = $.parseJSON(response);
			if (response.status == "success") {
				fetchAuctionDetails();
			}
		});
	})
}


function placeBid(event) {
	event.preventDefault();
	var request = {};
	request.action				=	"create-bid";
	request.value				=	$('#place-bid-modal .value').val();
	request.number				=	$('#place-bid-modal .number').val();
	request.allow_partial_fill	=	($('#place-bid-modal .allow_partial_fill').val())? true:false;
	request.auction_sno			=	$('#place-bid-modal .auction_sno').val();
	request.user_sno			=	$('#place-bid-modal .user_sno').val();

	$.ajax({
		type	:	'POST',
		url		:	EndPoint,
		data	:	request
	}).done(function(response) {
		response = $.parseJSON(response);
		if (response.status == "success") {
			listAuctionBids();
			$(".modal").modal("hide");
		}
		toastr.info(response.message);
	});
}

function listAuctionBids() {
	var request = {};
	request.action = "bid-list";
	request.auction_sno = AUCTION_SNO;
	$.ajax({
		type	:	'POST',
		url		:	EndPoint,
		data	:	request
	}).done(function(res) {
		res = $.parseJSON(res);
		if (res.status == "success") {
			var html = '';
			// moment("12/4/2016 00:00").isAfter();
			$.each(res.data, function(i, bid) {
				var disabled = (AUCTION_STATUS < 3)? "":"disabled";
				var value = (bid.value == 0)? "Competitive Bid": bid.value;
				html += '<tr>'+
							'<td data-width="150px" style="width:100px">'+
								'<div class="faculty-image-holder form-group">'+
									'<img title="'+bid.user_name+'" class="img-responsive" src="/assets/img/user-images/'+bid.user_sno+'.jpeg">'+
								'</div>'+
							'</td>'+
							'<td> '+bid.user_name+' </td>'+
							'<td>'+bid.number+' </td>'+
							'<td>'+value+'</td>'+
							'<td>'+
								'<button type="button" data-id="'+bid.bid_sno+'" '+disabled+' class="btn btn-xs btn-danger cancel-bid" data-tittle="Cancel Bid">Cancel</button>'+
							'</td>'+
						'</tr>';
			});
			$('#bid-list-table tbody').html(html);
			cancelBid();
		}
	});
}

function cancelBid() {
	$(".cancel-bid").off("click")
	$(".cancel-bid").on("click", function(event) {
		event.preventDefault();
		var request = {};
		request.action = "cancel-bid";
		request.bid_sno = $(this).data("id");
		$.ajax({
			type	:	'POST',
			url		:	EndPoint,
			data	:	request
		}).done(function(response) {
			response = $.parseJSON(response);
			if (response.Status == "success") {
				listAuctionBids();
			}
			toastr.info(response.Message);
		});
	})
}