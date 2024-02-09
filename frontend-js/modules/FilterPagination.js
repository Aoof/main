export default class FilterPagination {
    constructor() {
        this.paginationCores = document.querySelectorAll(".pagination");
        this.filterCores = document.querySelectorAll(".filter");

        this.paginators = [];
        this.filters = [];
        this.events();
    }

    events() {
        this.loadPagination();
        this.loadFilter();

        document.querySelector(".search-wrapper.filter").addEventListener("click", (e) => {
            document.querySelector(".filter-query").focus();
        });
    }

    loadPagination() {
        this.paginationCores.forEach(paginationCore => {
            let paginator = document.querySelector(`.paginator[data-index="${paginationCore.dataset.index}"]`);
            if (!paginator) return;

            let paginatees = paginator.querySelectorAll(".paginatee:not(.filtered--hide)");
            paginatees.forEach((paginatee, index) => {
                paginatee.dataset.index = index;
            });

            let page = parseInt(paginationCore.dataset.page) || 1;
            let amount = parseInt(paginationCore.dataset.amount) || 5;

            let paginationLinks = paginationCore.querySelectorAll(".pagination-link");
            this.setupPaginator(paginationLinks, paginatees, paginator, paginationCore, page);

            paginationLinks.forEach(paginationLink => {
                paginationLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    this.handlePaginationClick(paginationLink, paginationCore, amount);
                });
            });

            this.updatePos(paginationCore.dataset.index);
            this.createPagination(`.pagination[data-index="${paginationCore.dataset.index}"]`, paginatees.length, amount, page);
        });
    }

    setupPaginator(paginationLinks, paginatees, paginator, paginationCore, page) {
        let index = this.paginators.length;
        paginator.dataset.page = page;
        paginator.dataset.index = index;
        paginationCore.dataset.index = index;

        this.paginators.push({
            index,
            paginationLinks,
            paginatees,
            paginator,
            paginationCore,
            page
        });
    }

    handlePaginationClick(paginationLink, paginationCore, amount) {
        let paginator = this.paginators[paginationCore.dataset.index];
        let newPage = paginator.page;

        if (paginationLink.classList.contains("ind")) {
            newPage = parseInt(paginationLink.dataset.page);
        } else if (paginationLink.classList.contains("left")) {
            newPage--;
        } else if (paginationLink.classList.contains("right")) {
            newPage++;
        }

        newPage = Math.max(1, newPage);
        newPage = Math.min(newPage, Math.ceil(paginator.paginatees.length / amount));

        paginator.page = newPage;
        paginator.paginationLinks.forEach(link => link.classList.remove("active"));
        paginator.paginationLinks.forEach(link => {
            if (parseInt(link.dataset.page) === newPage) {
                link.classList.add("active");
            }
        });

        this.updatePos(paginator.index);
    }

    updatePos(pos) {
        let paginator = this.paginators[pos];
        if (!paginator) return;

        let amount = parseInt(paginator.paginationCore.dataset.amount) || 5;
        paginator.paginatees.forEach(paginatee => {
            paginatee.classList.add("paginatee--hide");
            paginatee.classList.remove("paginatee--show");

            let index = parseInt(paginatee.dataset.index);
            if (index >= (paginator.page - 1) * amount && index < paginator.page * amount) {
                paginatee.classList.remove("paginatee--hide");
                paginatee.classList.add("paginatee--show");
            }
        });
    }

    loadFilter() {
        this.filterCores.forEach(filterCore => {
            let filterContainer = document.querySelector(`.filter-container[data-index="${filterCore.dataset.index}"]`);
            if (!filterContainer) return;

            let filtered = filterContainer.querySelectorAll(".filtered");
            let query = filterCore.querySelector(".filter-query");

            this.setupFilter(filtered, filterCore, filterContainer);

            query.addEventListener("keyup", () => {
                let tags = Array.from(filterCore.querySelectorAll(".filter-option-tag")).map(tag => tag.textContent.toLowerCase());
                this.handleFilter(filterCore, query.value.toLowerCase(), tags);
                this.loadPagination();
            });

            query.dispatchEvent(new Event("keyup"));
        });
    }

    setupFilter(filtered, filterCore, filterContainer) {
        let index = this.filters.length;
        filterCore.dataset.index = index;

        this.filters.push({
            index,
            filtered,
            filterCore,
            filterContainer,
        });
    }

    handleFilter(filterCore, searchTerm, extraTerms = []) {
        let filter = this.filters[filterCore.dataset.index];

        filter.filtered.forEach(item => {
            item.classList.remove("filtered--hide");
            item.classList.add("filtered--show");

            let text = "";

            item.querySelectorAll(".search-include").forEach(searchInclude => text += searchInclude.textContent.toLowerCase())

            if (!text.includes(searchTerm) || !extraTerms.every(term => text.includes(term))) {
                item.classList.remove("filtered--show");
                item.classList.add("filtered--hide");
            }
        });

        let paginationCore = this.paginators[filter.index].paginationCore;
        let paginatees = paginationCore.querySelectorAll(".paginatee:not(.filtered--hide)");
        let amount = parseInt(paginationCore.dataset.amount) || 5;
        let currentPage = parseInt(paginationCore.dataset.page) || 1;

        this.createPagination(`.pagination[data-index="${filterCore.dataset.index}"]`, paginatees.length, amount, currentPage);
    }

    createPagination(containerSelector, totalItems, itemsPerPage, currentPage) {
        const container = document.querySelector(containerSelector) || document.querySelector('.pagination'); 
        container.innerHTML = ''; 
    
        if (totalItems === 0) {
            container.innerHTML = '<p>No Recipes Found</p>';
            return;
        }
    
        const totalPages = Math.ceil(totalItems / itemsPerPage);
    
        const leftArrow = document.createElement('a');
        leftArrow.className = 'pagination-link left';
        leftArrow.dataset.page = Math.max(1, currentPage - 1);
        leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
        container.appendChild(leftArrow);

        const pageLink = document.createElement('a');
        pageLink.className = 'pagination-link ind';
        pageLink.dataset.page = currentPage;
        pageLink.textContent = currentPage + " / " + totalPages;
        pageLink.classList.add('active');
        container.appendChild(pageLink);
    
        const rightArrow = document.createElement('a');
        rightArrow.className = 'pagination-link right';
        rightArrow.dataset.page = Math.min(totalPages, currentPage + 1);
        rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
        container.appendChild(rightArrow);
    
        container.querySelectorAll('.pagination-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const newPage = parseInt(link.dataset.page);
                this.createPagination(containerSelector, totalItems, itemsPerPage, newPage);
                this.handlePaginationClick(link, container, itemsPerPage);
            });
        });
    }
}
