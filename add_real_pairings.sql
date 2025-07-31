-- Add realistic pairings to PairDish database based on actual dishes
-- Main dishes: IDs 1-5
-- Other dishes: IDs 6-10

-- Clear any existing pairings first (optional)
DELETE FROM pairings;

-- For 15 Bean Soup (ID: 1)
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(1, 7, 85, 'A charcuterie board with crackers and cheese complements hearty soup', 1),
(1, 9, 80, 'A simple cheese board provides protein to balance the beans', 2),
(1, 2, 75, 'A baked potato makes the meal more filling', 3);

-- For Baked Potato (ID: 2)
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(2, 1, 85, 'Bean soup pairs wonderfully with a loaded baked potato', 1),
(2, 7, 80, 'Charcuterie provides variety of toppings for the potato', 2),
(2, 10, 75, 'Cheese souffle adds an elegant touch to simple potato', 3);

-- For Baked Potato Bar (ID: 3)
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(3, 7, 90, 'Charcuterie items make great potato toppings', 1),
(3, 9, 85, 'Cheese board provides variety of cheeses for toppings', 2),
(3, 1, 80, 'Bean soup as a hearty side option', 3),
(3, 6, 75, 'Another casserole for variety at the bar', 4);

-- For BLT (ID: 4)
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(4, 2, 90, 'Baked potato or potato wedges are classic with sandwiches', 1),
(4, 1, 85, 'A cup of soup with sandwich is a classic combo', 2),
(4, 7, 75, 'Small charcuterie board for a fancy lunch', 3);

-- For Breakfast Casserole (ID: 5)
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(5, 2, 85, 'Hash browns or roasted potatoes complement breakfast', 1),
(5, 7, 80, 'Morning charcuterie with fruits and pastries', 2),
(5, 9, 75, 'Cheese board for a brunch spread', 3);

-- For Casserole (ID: 6) as main
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(6, 2, 85, 'Baked potato as a simple side to casserole', 1),
(6, 1, 80, 'Soup as a starter before casserole', 2),
(6, 7, 75, 'Light appetizer board before hearty casserole', 3);

-- For Charcuterie Board (ID: 7) as main
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(7, 1, 90, 'Soup pairs perfectly with a charcuterie spread', 1),
(7, 10, 85, 'Cheese souffle adds elegance to charcuterie dinner', 2),
(7, 2, 75, 'Small baked potatoes as a hearty addition', 3);

-- For Charcuterie Board for Dinner (ID: 8) as main
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(8, 1, 90, 'Hearty soup complements an evening charcuterie', 1),
(8, 10, 85, 'Cheese souffle for an upscale dinner pairing', 2),
(8, 6, 80, 'Small portion of casserole for substantial meal', 3);

-- For Cheese Board (ID: 9) as main
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(9, 1, 85, 'Bean soup provides warmth with cold cheese board', 1),
(9, 10, 90, 'Cheese souffle for the ultimate cheese experience', 2),
(9, 2, 75, 'Baked potato for a more filling meal', 3);

-- For Cheese Souffle (ID: 10) as main
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(10, 7, 90, 'Charcuterie as an elegant starter before souffle', 1),
(10, 9, 85, 'Cheese board to continue the cheese theme', 2),
(10, 1, 75, 'Light soup before rich souffle', 3);

-- Check the results
SELECT COUNT(*) as total_pairings FROM pairings;