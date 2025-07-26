import { render, screen, fireEvent } from '@testing-library/react'
import RecipeCard from '../RecipeCard'
import { Recipe } from '@/types'

const mockRecipe: Recipe = {
  id: 1,
  title: 'Test Recipe',
  slug: 'test-recipe',
  description: 'A delicious test recipe',
  imageUrl: 'https://example.com/test-recipe.jpg',
  prepTime: 15,
  cookTime: 30,
  servings: 4,
  difficulty: 'medium',
  ingredients: ['ingredient 1', 'ingredient 2'],
  instructions: ['step 1', 'step 2']
}

describe('RecipeCard', () => {
  it('renders recipe information correctly', () => {
    render(<RecipeCard recipe={mockRecipe} />)

    expect(screen.getByText('Test Recipe')).toBeInTheDocument()
    expect(screen.getByText('A delicious test recipe')).toBeInTheDocument()
    expect(screen.getByText('45 min')).toBeInTheDocument() // Total time (15 + 30)
    expect(screen.getByText('medium')).toBeInTheDocument()
  })

  it('renders image when imageUrl is provided', () => {
    render(<RecipeCard recipe={mockRecipe} />)

    const image = screen.getByAltText('Test Recipe')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/test-recipe.jpg')
  })

  it('handles image error gracefully', () => {
    render(<RecipeCard recipe={mockRecipe} />)

    const image = screen.getByAltText('Test Recipe')
    
    // Simulate image error
    fireEvent.error(image)

    // Check that fallback UI is displayed
    expect(screen.getByText('Image unavailable')).toBeInTheDocument()
    expect(screen.queryByAltText('Test Recipe')).not.toBeInTheDocument()
  })

  it('does not render image container when imageUrl is not provided', () => {
    const recipeWithoutImage = { ...mockRecipe, imageUrl: undefined }
    render(<RecipeCard recipe={recipeWithoutImage} />)

    expect(screen.queryByAltText('Test Recipe')).not.toBeInTheDocument()
    expect(screen.queryByText('Image unavailable')).not.toBeInTheDocument()
  })

  it('handles recipe without description', () => {
    const recipeWithoutDescription = { ...mockRecipe, description: undefined }
    render(<RecipeCard recipe={recipeWithoutDescription} />)

    expect(screen.getByText('Test Recipe')).toBeInTheDocument()
    expect(screen.queryByText('A delicious test recipe')).not.toBeInTheDocument()
  })

  it('handles recipe without difficulty', () => {
    const recipeWithoutDifficulty = { ...mockRecipe, difficulty: undefined }
    render(<RecipeCard recipe={recipeWithoutDifficulty} />)

    expect(screen.getByText('Test Recipe')).toBeInTheDocument()
    expect(screen.queryByText('medium')).not.toBeInTheDocument()
  })

  it('handles recipe with zero prep and cook time', () => {
    const recipeWithoutTime = { ...mockRecipe, prepTime: 0, cookTime: 0 }
    render(<RecipeCard recipe={recipeWithoutTime} />)

    expect(screen.getByText('Test Recipe')).toBeInTheDocument()
    expect(screen.queryByText(/min/)).not.toBeInTheDocument()
  })

  it('handles recipe with only prep time', () => {
    const recipeWithOnlyPrepTime = { ...mockRecipe, cookTime: 0 }
    render(<RecipeCard recipe={recipeWithOnlyPrepTime} />)

    expect(screen.getByText('15 min')).toBeInTheDocument()
  })

  it('handles recipe with only cook time', () => {
    const recipeWithOnlyCookTime = { ...mockRecipe, prepTime: 0 }
    render(<RecipeCard recipe={recipeWithOnlyCookTime} />)

    expect(screen.getByText('30 min')).toBeInTheDocument()
  })
})