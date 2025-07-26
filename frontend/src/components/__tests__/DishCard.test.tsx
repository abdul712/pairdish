import { render, screen, fireEvent } from '@testing-library/react'
import DishCard from '../DishCard'
import { Dish } from '@/types'

const mockDish: Dish = {
  id: 1,
  name: 'Test Dish',
  slug: 'test-dish',
  description: 'A delicious test dish',
  category: 'Main Course',
  cuisine: 'Italian',
  imageUrl: 'https://example.com/test-image.jpg',
  pairings: ['Side 1', 'Side 2', 'Side 3']
}

describe('DishCard', () => {
  it('renders dish information correctly', () => {
    render(<DishCard dish={mockDish} />)

    expect(screen.getByText('Test Dish')).toBeInTheDocument()
    expect(screen.getByText('A delicious test dish')).toBeInTheDocument()
    expect(screen.getByText('MAIN COURSE')).toBeInTheDocument()
    expect(screen.getByText('3 pairings')).toBeInTheDocument()
  })

  it('renders image when imageUrl is provided', () => {
    render(<DishCard dish={mockDish} />)

    const image = screen.getByAltText('Test Dish')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg')
  })

  it('handles image error gracefully', () => {
    render(<DishCard dish={mockDish} />)

    const image = screen.getByAltText('Test Dish')
    
    // Simulate image error
    fireEvent.error(image)

    // Check that fallback UI is displayed
    expect(screen.getByText('Image unavailable')).toBeInTheDocument()
    expect(screen.queryByAltText('Test Dish')).not.toBeInTheDocument()
  })

  it('does not render image container when imageUrl is not provided', () => {
    const dishWithoutImage = { ...mockDish, imageUrl: undefined }
    render(<DishCard dish={dishWithoutImage} />)

    expect(screen.queryByAltText('Test Dish')).not.toBeInTheDocument()
    expect(screen.queryByText('Image unavailable')).not.toBeInTheDocument()
  })

  it('displays correct number of pairings', () => {
    render(<DishCard dish={mockDish} />)
    expect(screen.getByText('3 pairings')).toBeInTheDocument()
  })

  it('handles dish with no pairings', () => {
    const dishWithoutPairings = { ...mockDish, pairings: undefined }
    render(<DishCard dish={dishWithoutPairings} />)

    expect(screen.getByText('0 pairings')).toBeInTheDocument()
  })

  it('handles dish without description', () => {
    const dishWithoutDescription = { ...mockDish, description: undefined }
    render(<DishCard dish={dishWithoutDescription} />)

    expect(screen.getByText('Test Dish')).toBeInTheDocument()
    expect(screen.queryByText('A delicious test dish')).not.toBeInTheDocument()
  })
})