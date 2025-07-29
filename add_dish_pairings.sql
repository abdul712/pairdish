-- Add dish pairings to the PairDish database
-- This script adds pairings between main dishes (IDs 1-5) and appropriate side dishes

-- First, let's check what dishes we need to work with (IDs 6-10)
-- Based on common culinary patterns, I'll assume these are typical side dishes

-- Pairings for 15 Bean Soup (ID: 1)
-- Bean soup pairs well with bread, salads, and light sides
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(1, 6, 95, 'Crusty bread is perfect for dipping in hearty bean soup', 1),
(1, 7, 85, 'A fresh green salad provides a light contrast to the hearty soup', 2),
(1, 8, 80, 'Cornbread complements the rustic flavors of bean soup', 3),
(1, 2, 75, 'A simple baked potato can make the meal more filling', 4);

-- Pairings for Baked Potato (ID: 2)
-- Baked potatoes pair well with proteins and vegetables
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(2, 9, 90, 'Steamed broccoli is a classic healthy pairing with baked potato', 1),
(2, 10, 85, 'A side salad adds freshness and nutrients', 2),
(2, 7, 85, 'Green salad provides a refreshing contrast', 3),
(2, 6, 70, 'Garlic bread can complement if serving as a lighter meal', 4);

-- Pairings for Baked Potato Bar (ID: 3)
-- A potato bar is versatile and pairs with various toppings and sides
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(3, 10, 90, 'Coleslaw adds crunch and tang to complement loaded potatoes', 1),
(3, 9, 85, 'Steamed vegetables provide healthy options for the bar', 2),
(3, 7, 85, 'A fresh salad balances the hearty potato bar', 3),
(3, 6, 75, 'Bread rolls for those wanting extra carbs', 4),
(3, 8, 70, 'Cornbread as an additional starch option', 5);

-- Pairings for BLT (ID: 4)
-- BLT sandwiches pair well with classic sides
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(4, 10, 95, 'Coleslaw is a classic sandwich side that adds crunch', 1),
(4, 2, 85, 'Potato wedges or baked potato complements sandwiches well', 2),
(4, 7, 80, 'A side salad echoes the lettuce in the BLT', 3),
(4, 9, 75, 'Pickled vegetables add tang and crunch', 4);

-- Pairings for Breakfast Casserole (ID: 5)
-- Breakfast casseroles pair with morning sides and fruits
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(5, 6, 90, 'Toast or biscuits are perfect for breakfast', 1),
(5, 7, 85, 'Fresh fruit salad complements hearty breakfast dishes', 2),
(5, 8, 80, 'Cornbread muffins work well with breakfast casseroles', 3),
(5, 10, 75, 'Hash browns or roasted potatoes for extra heartiness', 4);

-- Additional cross-pairings where dishes can serve as sides to each other
-- Bean soup as a side to baked potato bar
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(3, 1, 80, 'A cup of bean soup can be a warming side to a potato bar', 6);

-- Breakfast casserole can pair with a simple baked potato
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(5, 2, 70, 'Home fries or roasted potatoes complement breakfast dishes', 5);

-- Let's also add some reverse pairings where it makes sense
-- For example, if someone searches "what goes with cornbread" (assuming ID 8)
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(8, 1, 95, 'Cornbread is a classic pairing with bean soup', 1),
(8, 5, 80, 'Cornbread works well with hearty breakfast casseroles', 2);

-- If garlic bread is ID 6
INSERT INTO pairings (main_dish_id, side_dish_id, match_score, pairing_reason, order_position) VALUES
(6, 1, 95, 'Garlic bread is perfect for dipping in soup', 1),
(6, 7, 85, 'Garlic bread complements fresh salads', 2);

-- Note: This assumes the following for IDs 6-10:
-- 6: Garlic bread or similar bread item
-- 7: Green salad or garden salad
-- 8: Cornbread
-- 9: Steamed vegetables or broccoli
-- 10: Coleslaw or potato side

-- The actual dish names for IDs 6-10 should be confirmed from your database
-- and these pairings adjusted accordingly for accuracy