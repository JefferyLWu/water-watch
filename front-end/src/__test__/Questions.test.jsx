import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import {describe, expect, it, beforeEach} from 'vitest';
import Questions from '../components/Questions';

describe("Testing slider buttons", () => {
    beforeEach(() => {
        // Mocking window.location.href to avoid actual navigation in tests
        const url = new URL('http://localhost/slide1');
        delete window.location;
        window.location = { ...url, href: url.href };
    });

    it("Goes to next carousel with next button", () => {
        render(<Questions />);
        const nextButton = screen.getByRole('button', { name: '❯' });  
        fireEvent.click(nextButton)
        expect(window.location.href).toBe('http://localhost/slide2');

    })
    it("Goes to previous carousel with prev button", () => {
        render(<Questions />);
        const nextButton = screen.getByRole('button', { name: '❯' });
        const prevButton = screen.getByRole('button', { name: '❮' });

        // Move to the next slide first
        fireEvent.click(nextButton);
        expect(window.location.href).toBe('http://localhost/slide2');

        // Then move back to the previous slide
        fireEvent.click(prevButton);
        expect(window.location.href).toBe('http://localhost/slide1');
    })
})

describe("Testing form inputs", () => {
    beforeEach(() => {
        render(<Questions />);
    });

    it("Updates weight input", () => {
        const weightInput = screen.getByRole('textbox', { name: /weight/i });
        fireEvent.change(weightInput, { target: { value: '70' } });
        expect(weightInput.value).toBe('70');
    });

    it("Updates gender select", () => {
        const genderSelect = screen.getByRole('combobox', { name: /gender/i });
        fireEvent.change(genderSelect, { target: { value: 'female' } });
        expect(genderSelect.value).toBe('female');
    });
});

describe('Questions and Results integration test', () => {
    beforeEach(() => {
      render(<Questions />);
    });
  
    it('updates and displays the correct results based on input', async () => {
      // Simulate user input
      fireEvent.change(screen.getByLabelText('weight'), { target: { value: '70' } });
      fireEvent.change(screen.getByLabelText('gender'), { target: { value: 'female' } });
      fireEvent.change(screen.getByLabelText('exercise'), { target: { value: '30' } });
  
      // Simulate climate selection
      fireEvent.change(screen.getByLabelText('climate'), { target: { value: 'warm' } });
  
      // Check that the Results component displays the correct values
      const dailyIntake = (0.5 * 70 + 8 + 12) * 29.57; // Calculated based on your function logic
      const expectedDailyIntake = `${(Math.round((dailyIntake / 1000) * 10) / 10).toFixed(1)}L`;
      await waitFor(() => {
        // Since no water has been drank, should display value twice
        const resultElements = screen.getAllByText(expectedDailyIntake);
        expect(resultElements.length).toBeGreaterThan(0);
      });
    });
  });