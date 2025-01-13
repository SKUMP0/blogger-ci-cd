describe('Frontend Tests', () => {
    beforeEach(() => {
        // Navigate to the homepage before each test
        cy.visit('/');
    });

    it('should load the homepage', () => {
        // Verify that the homepage loads and includes the "Add Blog" button
        cy.contains('Add Blog').should('exist');
    });

    it('should display all blogs', () => {
        // Target the table body with ID 'tableContent' to verify blogs are loaded
        cy.get('#tableContent').find('tr').its('length').should('be.gte', 1); // At least one row
    });

    it('should add a new blog', () => {
        // Open the Add Blog modal
        cy.contains('Add Blog').click();

        // Fill out the form fields
        cy.get('#title').type('Test Blog Title'); // Update IDs based on your form
        cy.get('#content').type('This is a test blog content.');
        cy.get('#author').type('test@example.com');

        // Submit the blog using the "Add New Post" button
        cy.contains('Add New Post').click();

        // Verify the success message (if applicable)
        cy.get('#message').should('contain', 'posted!');

        // Verify the new blog appears in the table
        cy.get('#tableContent').contains('Test Blog Title').should('exist');
    });
});
