# FilterPagination Class Documentation

## Overview

The `FilterPagination` class is designed to provide pagination and filtering functionality for a web page. It allows users to navigate through paginated content while dynamically filtering items based on a search query.

## Usage

1. **Initialization:**

    ```javascript
    import FilterPagination from './FilterPagination';

    const filterPagination = new FilterPagination();
    ```

   The class is instantiated automatically upon creation, and the pagination and filter elements are initialized.

2. **Pagination Setup:**

   Pagination is applied to elements with the class `.pagination`. Each pagination element should have child elements with the class `.paginator` and `.pagination-link`. Paginatees are specified with the class `.paginatee`.

   Example:

   ```html
   <div class="pagination" data-index="0" data-page="1" data-amount="5">
       <div class="paginator" data-index="0">
           <div class="paginatee">Item 1</div>
           <div class="paginatee">Item 2</div>
           <!-- ... -->
       </div>
       <a class="pagination-link ind" data-page="1">1</a>
       <!-- ... -->
   </div>
   ```

3. **Filter Setup:**

   Filtering is applied to elements with the class `.filter`. The filter input is specified with the class `.filter-query`.

   Example:

   ```html
   <div class="filter" data-index="0">
       <input type="text" class="filter-query" placeholder="Search...">
       <div class="filter-container" data-index="0">
           <div class="filtered">Filtered Item 1</div>
           <div class="filtered">Filtered Item 2</div>
           <!-- ... -->
       </div>
   </div>
   ```

4. **Event Handling:**

   Pagination and filtering events are automatically handled upon class instantiation.

## Methods

### `loadPagination()`

   Initializes pagination for each `.pagination` element on the page.

### `loadFilter()`

   Initializes filtering for each `.filter` element on the page.

### `setupPaginator(paginationLinks, paginatees, paginator, paginationCore, page)`

   Sets up pagination parameters for a specific paginator.

### `handlePaginationClick(paginationLink, paginationCore, amount)`

   Handles pagination link clicks and updates the displayed page.

### `updatePos(pos)`

   Updates the visibility of paginatees based on the current page.

### `setupFilter(filtered, filterCore, filterContainer)`

   Sets up filtering parameters for a specific filter.

### `handleFilter(query, filterCore)`

   Handles filter input changes and updates the displayed items accordingly.

### `createPagination(containerSelector, totalItems, itemsPerPage, currentPage)`

   Dynamically creates pagination links based on the specified parameters.

## Notes

- Pagination and filtering are automatically updated when there are changes to the relevant elements on the page.
- The class uses Font Awesome icons for pagination arrows.

Feel free to customize the HTML structure and adjust class names based on your specific implementation.