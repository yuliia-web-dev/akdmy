"use strict"

document.addEventListener("click", documentActions);

function documentActions(e) {
	const targetElement = e.target;

	// Toggle menu on burger icon click
	if (targetElement.closest('.icon-menu')) {
		document.body.classList.toggle('menu-open');
		targetElement.closest('.icon-menu').classList.toggle('active');
	}

	// Close menu and reset icon on link click inside the menu
	if (targetElement.closest('.menu') && targetElement.tagName === 'A') {
		document.body.classList.remove('menu-open');

		// Remove 'active' class from all burger icons
		const icons = document.querySelectorAll('.icon-menu');
		icons.forEach(icon => icon.classList.remove('active'));
	}
}



window.addEventListener('scroll', () => {
	const header = document.querySelector('header');
	if (window.scrollY > 50) { // Кількість пікселів, після яких змінюється фон
		header.classList.add('scrolled');
	} else {
		header.classList.remove('scrolled');
	}
});
//========================================

document.addEventListener("DOMContentLoaded", function () {
	function moveElements() {
		const screenWidth = window.innerWidth;
		const elementsToMove = document.querySelectorAll("[data-da]");

		elementsToMove.forEach(function (element) {
			const data = element.getAttribute("data-da").split(",");
			if (data.length === 3) {
				const destinationSelector = data[0].trim();
				const order = parseInt(data[1].trim());
				const requiredScreenWidth = parseInt(data[2].trim());

				const destination = document.querySelector(destinationSelector);
				if (!destination) return;

				// Збереження початкового контейнера
				if (!element.dataset.originalParent) {
					const parent = element.parentNode;
					const index = Array.from(parent.children).indexOf(element);
					element.dataset.originalParent = parent.tagName.toLowerCase() + (parent.id ? `#${parent.id}` : '') + (parent.className ? `.${parent.className.replace(/\s+/g, '.')}` : '');
					element.dataset.originalIndex = index;
				}

				if (screenWidth <= requiredScreenWidth && !element.classList.contains("moved")) {
					// Переміщення в нове місце
					if (order === 1) {
						destination.insertBefore(element, destination.firstChild);
					} else {
						const previousElement = destination.children[order - 2];
						if (previousElement) {
							destination.insertBefore(element, previousElement.nextSibling);
						} else {
							destination.appendChild(element);
						}
					}
					element.classList.add("moved");
				} else if (screenWidth > requiredScreenWidth && element.classList.contains("moved")) {
					// Повернення на початкове місце
					const originalParentSelector = element.dataset.originalParent;
					const originalIndex = parseInt(element.dataset.originalIndex, 10);
					const originalParent = document.querySelector(originalParentSelector);

					if (originalParent) {
						const children = Array.from(originalParent.children);
						if (originalIndex < children.length) {
							originalParent.insertBefore(element, children[originalIndex]);
						} else {
							originalParent.appendChild(element);
						}
						element.classList.remove("moved");
					}
				}
			}
		});
	}

	moveElements();

	window.addEventListener("resize", function () {
		moveElements();
	});
});

//=============hero animation==========

document.addEventListener("DOMContentLoaded", () => {
	const elements = document.querySelectorAll('.hero__title, .hero__text, .hero__button');

	if (!elements.length) return;

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
				observer.unobserve(entry.target);
			}
		});
	}, {
		threshold: 0.1
	});

	elements.forEach(el => observer.observe(el));
});

//========================

document.addEventListener("DOMContentLoaded", function () {
	if (!("IntersectionObserver" in window)) {
		// fallback: показати одразу
		const fallbackEls = document.querySelectorAll(".counter__item, .features__title, .features__item");
		for (let i = 0; i < fallbackEls.length; i++) {
			fallbackEls[i].classList.add("visible");
		}
		return;
	}

	const elementsToObserve = document.querySelectorAll(".counter__item, .features__title, .features__item");

	const observer = new IntersectionObserver(function (entries, obs) {
		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i];
			if (entry.isIntersecting) {
				entry.target.classList.add("visible");
				obs.unobserve(entry.target);
			}
		}
	}, {
		threshold: 0.5
	});

	for (let j = 0; j < elementsToObserve.length; j++) {
		observer.observe(elementsToObserve[j]);
	}
});

const spaceId = 'pw19h87cnohd';
const accessToken = 't7Ub5RgzRLiH8H7-i4XhXBxvkM6vKZEYH0KAYEeW4uM';
const environmentId = 'master';
const contentType = 'heroSection';

async function fetchHeroData() {
	try {
		const res = await fetch(`https://cdn.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries?access_token=${accessToken}&content_type=${contentType}&include=1`);
		const data = await res.json();

		const item = data.items[0];
		const assetId = item.fields.backgroundImage.sys.id;
		const asset = data.includes.Asset.find(asset => asset.sys.id === assetId);

		// Текстові поля
		document.getElementById('hero-title').innerHTML =
			`${item.fields.titleBefore} <span class="highlighted">${item.fields.titleHighlight}</span>`;

		document.getElementById('hero-subtitle').textContent = item.fields.subtitle;
		document.querySelector('.hero__button').textContent = item.fields.buttonText;

		// Зображення
		const imageUrl = asset.fields.file.url.startsWith('//') ? 'https:' + asset.fields.file.url : asset.fields.file.url;
		document.getElementById('hero-background').src = imageUrl;

	} catch (error) {
		console.error('Contentful fetch error:', error);
	}
}

fetchHeroData();

async function fetchPrivacySections() {
	try {
		const res = await fetch(`https://cdn.contentful.com/spaces/${spaceId}/environments/${environmentId}/entries?access_token=${accessToken}&content_type=privacySection`);
		const data = await res.json();

		const wrapper = document.querySelector('.privacy-data__wrapper');
		wrapper.innerHTML = '';

		data.items.forEach((item) => {
			const title = item.fields.sectionTitle || '';
			const listItems = item.fields.listItems || [];
			const paragraph = item.fields.paragraph || '';

			let contentHtml = '';

			if (listItems.length > 0) {
				contentHtml = `<ul class="item-privacy__list">` +
					listItems.map(li => `<li>${li}</li>`).join('') +
					`</ul>`;
			} else if (paragraph) {
				contentHtml = `<div class="item-privacy__text"><p>${paragraph}</p></div>`;
			}

			const sectionHtml = `
			<div class="privacy-data__item item-privacy">
			  <h3 class="item-privacy__title subtitle">${title}</h3>
			  ${contentHtml}
			</div>
		 `;

			wrapper.insertAdjacentHTML('beforeend', sectionHtml);
		});
	} catch (error) {
		console.error('Contentful fetch error:', error);
	}
}

fetchPrivacySections();
