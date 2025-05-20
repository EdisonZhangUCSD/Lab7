# Lab 7 - Unit & E2E Testing

## Check Your Understanding Answers

1. Where would you fit your automated tests in your Recipe project development pipeline?
   Answer: Within a Github action that runs whenever code is pushed
   Explanation: This approach ensures tests are run automatically on every code change, catching issues early in the development process. It prevents broken code from being merged into the main branch and provides immediate feedback to developers. This method maintains code quality consistently throughout development, saves time compared to manual testing, and creates a safety net for the entire team.

2. Would you use an end to end test to check if a function is returning the correct output?
   Answer: No
   Explanation: End-to-end tests are not the best choice for testing individual function outputs. They are designed to test complete user workflows and are slower and more resource-intensive. They test the entire application stack and are more brittle, potentially breaking due to unrelated changes. Unit tests are more appropriate for testing individual function outputs as they are faster, more focused, and easier to maintain.

3. What is the difference between navigation and snapshot mode?
   Answer: Navigation mode analyzes the page right after it loads, providing an overall performance metric but can't analyze interactions or changes in content. Snapshot mode analyzes the page in its current state, which is best for finding accessibility issues but can't analyze JavaScript performance or DOM tree changes.

4. Name three things we could do to improve the CSE 110 shop site based on the Lighthouse results:
   Answer: Based on the Lighthouse audit results, the site could be improved in three key areas. First, the accessibility audit revealed that the HTML element is missing a language attribute. Second, the performance audit showed potential savings of 34 KiB by serving images in next-gen formats and 316 KiB by properly sizing images. Third, the best practices audit identified missing security headers (CSP, HSTS, COOP, and XFO) that should be implemented to improve security. We could also properly save images with a potential savings of 316 KiB.





