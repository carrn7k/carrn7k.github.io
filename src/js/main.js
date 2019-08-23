
$( document ).ready(function() {
	$('.landing').css('background-color', 'black');
	$('#landing-msg').css('color', '#03A9F4');
	$('.projects-carousel').slick({
		slidesToShow: 4,
		dots: true,
		responsive: [
	    {
	      breakpoint: 480,
	      settings: {
	        slidesToShow: 3,
	        slidesToScroll: 1
	      }
	    }
	  ]
	});

	var learnMore = $('.learn-more');
	var tabs = $('.tabs');
	var modalClose = $('.modal-close');

	var userScrolling = true;

	const pages = {
		atHome: true,
		home: {
			home: true,
			page: $('.landing'),
			tab: $('#home-tab')
		},
		about: {
			page: $('#about'), 
			tab: $('#about-tab')
		}, 
		projects: {
			page: $('#projects'),
			tab: $('#projects-tab')
		},
		credentials: {
			page: $('#credentials'),
			tab: $('#credentials-tab')
		},
		contact: {
			page: $('#contact'),
			tab: $('#contact-tab')
		}

	}


	learnMore.click(function() {
		tabs.toggleClass('tabs-visible');
	})

	// project hover test
	$('.project-tile').mouseover(function() {
		$( this ).find('.project-title').addClass('project-title-display');
	});

	$('.project-tile').mouseout(function() {
		$( this ).find('.project-title').removeClass('project-title-display');
	});


	function scrollToPage(e, page) {

		userScrolling = false;

		pages.atHome = !('home' in page) ? false : true;
		var height = $( window ).height();
		var position = page.page.offset();

		tabs.toggleClass('tabs-visible');
		setTimeout(function() { 
			$('html, body').stop().animate({ scrollTop: position.top }, 650);
		}, 200);
		setTimeout(function() { 
			tabs.toggleClass('tabs-visible');
			tabs.css({ 'top': position.top + (height / 2) - 12 });
		}, 1000);
		
		!pages.atHome ? pages.home.tab.css('opacity', 1) : pages.home.tab.css('opacity', 0);

		tabs.children().each(function() {
			var currentElement = $( this );
			var currentTab = page.tab;

			currentElement.removeClass('tab-disable');
			if (currentElement.attr('id') === currentTab.attr('id')) {
				currentElement.addClass('tab-disable');
			} else {
				currentElement.removeClass('tab-disable');
				currentElement.addClass('tab-enable');
			}
		})

		e.preventDefault();

		setTimeout(function() {
			userScrolling	= true;
		}, 900);

	}

	pages.home.tab.click(function(e) {
		scrollToPage(e, pages.home);
	});
	pages.about.tab.click(function(e) {
		scrollToPage(e, pages.about);
	});
	pages.projects.tab.click(function(e) {
		scrollToPage(e, pages.projects);
	});
	pages.credentials.tab.click(function(e) {
		scrollToPage(e, pages.credentials);
	});
	pages.contact.tab.click(function(e) {
		scrollToPage(e, pages.contact);
	});

	// handle scroll event
	var timer;
	$(window).scroll(function() {
		if (userScrolling) {
			if (tabs.hasClass('tabs-visible')) {
				tabs.removeClass('tabs-visible');
			}
			clearTimeout(timer);
			timer = setTimeout( moveTabs, 300 );
		}
	})

	function moveTabs() {

		tabs.children().each(function() {
			var currentElement = $( this );
			currentElement.removeClass('tab-disable');
			currentElement.addClass('tab-enable');
		})

		const position = $(document).scrollTop();
		const height = $(window).height();

		position > 500 ? pages.atHome = false : pages.atHome = true;
		!pages.atHome ? pages.home.tab.css('opacity', 1) : pages.home.tab.css('opacity', 0);
		tabs.css({ 'top': position + (height / 2) - 12 });
		tabs.toggleClass('tabs-visible');
		/*setTimeout(function() {
			tabs.css({ 'top': position + (height / 2) });
			tabs.toggleClass('tabs-visible');
		}, 250);*/

	}

	// load projects to modal
	const projects = $('.project-tile');
	const modalTitle = $('.modal-title');
	const modalText = $('.modal-text');
	const gitLink = $('.github-link');
	const siteLink = $('.site-link');
	const modal = $('.modal');

	projects.each(function(i) {
		const currentProject = $( this );
		currentProject.click(function() {
			loadProject(currentProject);
		})
	})

	function loadProject(project) {
		const currentProject = texts[project.attr('name')];

		const currentTitle = currentProject.title;
		const currentText = currentProject.text;
		const currentGitLink = currentProject.links.github;
		const currentSiteLink = currentProject.links.site;
		modalTitle.text(currentTitle);
		modalText.text(currentText);

		if (currentGitLink !== '') {
			gitLink.attr('href', currentGitLink);
			gitLink.text('Check out the code');
			gitLink.css('display', 'block');
		} else {
			gitLink.css('display', 'none');
		}

		if (currentSiteLink !== '') {
			siteLink.attr('href', currentSiteLink);
			siteLink.text('Check out the site');
			siteLink.css('display', 'block');
		} else {
			siteLink.css('display', 'none');
		}
	}

	modalClose.click(function() {
		modal.hide();
		gitLink.text('')
		siteLink.text('');
	})

	// test modal 
	$('.project-tile').click(function() {
		modal.show();
	})

	/*
	$(window).scroll(function() {

		var position = $(window).scrollTop();
		tabs.removeClass('tabs-non-sticky');
		tabs.addClass('tabs-sticky')
		
	})
	*/
})
