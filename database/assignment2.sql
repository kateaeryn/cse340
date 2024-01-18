--Inserting Tony Stark Account

INSERT INTO public.account (
	account_firstname, 
	account_lastname, 
	account_email, 
	account_password)
VALUES ('Tony', 'Stark', 'tony@starknet.com', 'Iam1ronM@n');

--Change Tony to Admin
UPDATE public.account 
SET account_type = 'Admin'
WHERE account_id = 1;

--Deleting Tony Account
DELETE FROM public.account
WHERE account_id = 1;

--changing Hummer descip text
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

--Joining tables
SELECT 
inv_make,
inv_model,
classification_name
FROM
public.inventory
INNER JOIN public.classification
ON public.inventory.classification_id = public.classification.classification_id
WHERE public.classification.classification_name = 'Sport';

--fixing images file paths
UPDATE public.inventory
SET inv_image = REGEXP_REPLACE(inv_image, '/images\M','/images/vehicles','g');
UPDATE public.inventory
SET inv_thumbnail = REGEXP_REPLACE(inv_thumbnail, '/images\M','/images/vehicles', 'g');