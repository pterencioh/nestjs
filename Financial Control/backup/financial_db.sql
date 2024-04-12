--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: created_types; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.created_types AS ENUM (
    'default',
    'google'
);


ALTER TYPE public.created_types OWNER TO postgres;

--
-- Name: transaction_types; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transaction_types AS ENUM (
    'credit',
    'debit',
    'income'
);


ALTER TYPE public.transaction_types OWNER TO postgres;

--
-- Name: user_roles; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_roles AS ENUM (
    'user',
    'admin'
);


ALTER TYPE public.user_roles OWNER TO postgres;

--
-- Name: calculate_total_price(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calculate_total_price() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
		IF TG_OP = 'INSERT' OR
		(TG_OP = 'UPDATE' AND 
		 (OLD.unit_price <> NEW.unit_price OR
		 OLD.amount <> NEW.amount OR
		 OLD.total_installments <> NEW.total_installments))THEN
			
			IF (NEW.transaction_type = 'income' OR NEW.transaction_type = 'debit') THEN	
				NEW.total_price = NEW.unit_price * NEW.amount;			
			END IF;
			
			IF (NEW.transaction_type = 'credit') THEN	
				NEW.total_price = NEW.unit_price * NEW.total_installments;			
			END IF;
			
		END IF;
		
		RETURN NEW;
  	END;
$$;


ALTER FUNCTION public.calculate_total_price() OWNER TO postgres;

--
-- Name: check_status_installments(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_status_installments() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE amount_not_paid INTEGER;
DECLARE transaction_status BOOLEAN;
DECLARE new_status BOOLEAN;
	BEGIN
	
	IF TG_OP = 'UPDATE' AND (OLD.paid <> NEW.paid) THEN
	  SELECT COUNT(*) INTO amount_not_paid
      FROM credit_installments
      WHERE transaction_id = NEW.transaction_id
	  AND paid = FALSE;
	  
	  SELECT installments_paid INTO transaction_status
	  FROM transactions
      WHERE id = NEW.transaction_id;
	    
	  IF amount_not_paid >= 1 AND transaction_status = TRUE THEN
	  		new_status = FALSE;
	  END IF;
	  
	  IF amount_not_paid < 1 AND transaction_status = FALSE THEN
	  		new_status = TRUE;
	  END IF;
		  
	  IF new_status IS NOT NULL THEN
	  	  UPDATE transactions SET installments_paid = new_status WHERE id = NEW.transaction_id;
	  END IF;
	END IF;
	RETURN NEW;
  END;
$$;


ALTER FUNCTION public.check_status_installments() OWNER TO postgres;

--
-- Name: create_cash_flow(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_cash_flow() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
  		INSERT INTO cash_flow (user_id) VALUES (NEW.id);
      RETURN NEW;
  END;
$$;


ALTER FUNCTION public.create_cash_flow() OWNER TO postgres;

--
-- Name: create_credit_installments(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_credit_installments() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE amount_installments INTEGER;
DECLARE current_month TIMESTAMP = CURRENT_DATE;

	BEGIN
	
	IF TG_OP = 'INSERT' AND NEW.transaction_type = 'credit' THEN
		
	  amount_installments = NEW.total_installments;
	  
	  FOR num IN 1..amount_installments LOOP
	  	current_month = current_month + INTERVAL '1 month';
        INSERT INTO credit_installments (installment_number, month, value,transaction_id, user_id)
        VALUES (num, to_char(current_month, 'FMMonth'), NEW.unit_price, NEW.id, NEW.user_id);
      END LOOP;
	  
	END IF;
	RETURN NEW;
  END;
$$;


ALTER FUNCTION public.create_credit_installments() OWNER TO postgres;

--
-- Name: disable_update_credit(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.disable_update_credit() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
		IF (TG_OP = 'UPDATE' AND (NEW.transaction_type = 'income' OR NEW.transaction_type = 'debit') OR			
		 (NEW.transaction_type = 'credit' AND
	     OLD.description <> NEW.description OR
		 OLD.installments_paid <> NEW.installments_paid OR
		 OLD.has_receipt <> NEW.has_receipt OR
		 OLD.updated_at <> NEW.updated_at OR
		 OLD.receipt_id <> NEW.receipt_id ))THEN				
			RETURN NEW;			
		END IF;
		RETURN NULL;
  	END;
$$;


ALTER FUNCTION public.disable_update_credit() OWNER TO postgres;

--
-- Name: get_amount_transactions(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_amount_transactions() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE amount INTEGER;
DECLARE receiptID INTEGER;
	BEGIN
  	IF TG_OP = 'INSERT' AND NEW.receipt_id IS NOT NULL THEN
      SELECT COUNT(*) INTO amount
      FROM transactions
      WHERE receipt_id = NEW.receipt_id;
      
      receiptID = NEW.receipt_id;
      RETURN NEW;     
    ELSIF TG_OP = 'DELETE' AND OLD.receipt_id IS NOT NULL THEN
      SELECT COUNT(*) INTO amount
      FROM transactions
      WHERE receipt_id = OLD.receipt_id;
      
      receiptID = OLD.receipt_id;
  	ELSE
    	receiptID = NULL;
  	END IF;
	
  	IF receiptID IS NOT NULL THEN
 			UPDATE receipt SET amount_transactions = amount WHERE id = receiptID;
     	 RETURN OLD;     
    END IF;
    

  END;
$$;


ALTER FUNCTION public.get_amount_transactions() OWNER TO postgres;

--
-- Name: get_balance(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_balance() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE totalIncome DECIMAL(10,2);
DECLARE totalDebit DECIMAL(10,2);
DECLARE totalCreditPaid DECIMAL(10,2);
DECLARE totalBalance DECIMAL(10,2);
	BEGIN   
		IF ((TG_OP = 'INSERT' AND 
        (NEW.transaction_type = 'debit' OR NEW.transaction_type = 'income') OR
         
        (NEW.transaction_type = 'credit' AND 
         NEW.installments_paid = TRUE)) OR
        
        (TG_OP = 'UPDATE' AND
				((NEW.transaction_type = 'debit' OR NEW.transaction_type = 'income') AND
  				OLD.total_price != NEW.total_price) OR    

				(NEW.transaction_type = 'credit' AND 
         OLD.installments_paid != NEW.installments_paid AND
         NEW.installments_paid = TRUE))) THEN

             SELECT SUM(total_price) INTO totalDebit
             FROM transactions 
             WHERE user_id = NEW.user_id AND
             transaction_type = 'debit';
             
             IF totalDebit IS NULL THEN
               totalDebit = 0;    
             END IF;

             SELECT SUM(total_price) INTO totalCreditPaid
             FROM transactions 
             WHERE user_id = NEW.user_id AND
             transaction_type = 'credit' AND
             installments_paid = TRUE;
             
             IF totalCreditPaid IS NULL THEN
               totalCreditPaid = 0;    
             END IF;

             SELECT SUM(total_price) INTO totalIncome
             FROM transactions 
             WHERE user_id = NEW.user_id AND
             transaction_type = 'income';
             
             IF totalIncome IS NULL THEN
               totalIncome = 0;    
             END IF;
             
             totalBalance = totalIncome - (totalDebit + totalCreditPaid);
             
             UPDATE cash_flow
             SET balance = totalBalance
             WHERE user_id = NEW.user_id;     
             
             RETURN NEW;
             
    ELSIF TG_OP = 'DELETE' THEN
    
    				 SELECT SUM(total_price) INTO totalDebit
             FROM transactions 
             WHERE user_id = OLD.user_id AND
             transaction_type = 'debit';
             
             IF totalDebit IS NULL THEN
               totalDebit = 0;    
             END IF;

             SELECT SUM(total_price) INTO totalCreditPaid
             FROM transactions 
             WHERE user_id = OLD.user_id AND
             transaction_type = 'credit' AND
             installments_paid = TRUE;
             
             IF totalCreditPaid IS NULL THEN
               totalCreditPaid = 0;    
             END IF;

             SELECT SUM(total_price) INTO totalIncome
             FROM transactions 
             WHERE user_id = OLD.user_id AND
             transaction_type = 'income';
             
             IF totalIncome IS NULL THEN
               totalIncome = 0;    
             END IF;
             
             totalBalance = totalIncome - (totalDebit + totalCreditPaid);
             
             UPDATE cash_flow
             SET balance = totalBalance
             WHERE user_id = OLD.user_id;     
             
             RETURN NULL;
		ELSE
    	RETURN NEW;
    END IF; 
  END;
$$;


ALTER FUNCTION public.get_balance() OWNER TO postgres;

--
-- Name: get_total_credit_expenses(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_total_credit_expenses() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE totalCredit DECIMAL(10,2);
	BEGIN
  	IF(TG_OP = 'INSERT' AND 
       NEW.transaction_type = 'credit' AND 
       NEW.installments_paid = false ) THEN
       
       SELECT SUM(total_price) INTO totalCredit
       FROM transactions
       WHERE user_id = NEW.user_id AND
       transaction_type = 'credit' AND
       installments_paid = FALSE;
       
       IF totalCredit IS NULL THEN
          totalCredit = 0;
       END IF;
       
       UPDATE cash_flow 
       SET total_credit_expenses = totalCredit
       WHERE user_id = NEW.user_id;
       
       RETURN NEW;
    
    ELSIF ( TG_OP = 'DELETE' AND
    OLD.transaction_type = 'credit' AND 
    OLD.installments_paid = false ) THEN
    
       SELECT SUM(total_price) INTO totalCredit
       FROM transactions
       WHERE user_id = OLD.user_id AND
       transaction_type = 'credit' AND
       installments_paid = FALSE;
       
       IF totalCredit IS NULL THEN
          totalCredit = 0;
       END IF;
       
       UPDATE cash_flow 
       SET total_credit_expenses = totalCredit
       WHERE user_id = OLD.user_id;
       
       RETURN NULL;
    
    ELSE 
    	IF TG_OP = 'INSERT' THEN
      	RETURN NEW;
			END IF;
      
      IF TG_OP = 'DELETE' THEN
      	RETURN NULL;
			END IF;      
    END IF;
  END;
$$;


ALTER FUNCTION public.get_total_credit_expenses() OWNER TO postgres;

--
-- Name: get_total_expenses(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_total_expenses() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE totalExpenses DECIMAL(10,2);
	BEGIN
     IF(       
         (TG_OP = 'INSERT' AND      
         (NEW.transaction_type = 'debit' OR 
          NEW.transaction_type = 'credit' AND NEW.installments_paid = TRUE)) OR

         (TG_OP = 'UPDATE' AND OLD.total_price != NEW.total_price 
          AND
          (NEW.transaction_type = 'debit' OR
            (NEW.transaction_type = 'credit' AND 
            NEW.installments_paid = TRUE AND
            OLD.installments_paid != NEW.installments_paid))
         )      
       ) THEN
      
    	SELECT SUM(total_price) INTO totalExpenses
      FROM transactions
      WHERE user_id = NEW.user_id AND
      (transaction_type = 'debit' OR 
       transaction_type = 'credit' AND installments_paid = TRUE);
      
      UPDATE cash_flow
      SET total_expenses = totalExpenses
      WHERE user_id = NEW.user_id;
      
      RETURN NEW;
      
    ELSIF (TG_OP = 'DELETE' AND
       (OLD.transaction_type = 'debit' OR
        OLD.transaction_type = 'credit' AND OLD.installments_paid = TRUE)) THEN
       
    	SELECT SUM(total_price) INTO totalExpenses
      FROM transactions
      WHERE user_id = OLD.user_id AND
      (transaction_type = 'debit' OR 
       transaction_type = 'credit' AND installments_paid = TRUE);

      UPDATE cash_flow
      SET total_expenses = totalExpenses
      WHERE user_id = OLD.user_id;
       
      RETURN NULL;
       
    ELSE
       RETURN NEW;
    END IF;
  END;
$$;


ALTER FUNCTION public.get_total_expenses() OWNER TO postgres;

--
-- Name: get_total_price_receipt(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_total_price_receipt() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE totalPrice DECIMAL(10,2);
  BEGIN
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.receipt_id IS NOT NULL THEN
    
    	SELECT SUM(total_price) INTO totalPrice
      FROM transactions
      WHERE receipt_id = NEW.receipt_id;
      
      UPDATE receipt 
      SET total_price_transactions = totalPrice
      WHERE id = NEW.receipt_id;
      RETURN NEW;
      
    ELSIF TG_OP = 'DELETE' AND OLD.receipt_id IS NOT NULL THEN
    
    	SELECT SUM(total_price) INTO totalPrice
      FROM transactions
      WHERE receipt_id = OLD.receipt_id;
       
      UPDATE receipt
      SET total_price_transactions = totalPrice
      WHERE id = OLD.receipt_id;
    	
      RETURN OLD;
    END IF;
  END;
$$;


ALTER FUNCTION public.get_total_price_receipt() OWNER TO postgres;

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
  	IF TG_OP = 'UPDATE' THEN
    NEW.updated_at = NOW();
    
    RETURN NEW;
    END IF;
  END;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cash_flow; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cash_flow (
    id integer NOT NULL,
    balance numeric(10,2) DEFAULT 0.00 NOT NULL,
    total_expenses numeric(10,2) DEFAULT 0.00 NOT NULL,
    total_credit_expenses numeric(10,2) DEFAULT 0.00 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer NOT NULL,
    CONSTRAINT total_credit_is_positive CHECK ((total_credit_expenses >= (0)::numeric)),
    CONSTRAINT total_expenses_is_positive CHECK ((total_expenses >= (0)::numeric))
);


ALTER TABLE public.cash_flow OWNER TO postgres;

--
-- Name: cash_flow_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cash_flow_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cash_flow_id_seq OWNER TO postgres;

--
-- Name: cash_flow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cash_flow_id_seq OWNED BY public.cash_flow.id;


--
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id integer NOT NULL,
    name character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.category OWNER TO postgres;

--
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.category_id_seq OWNER TO postgres;

--
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- Name: credit_installments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credit_installments (
    id integer NOT NULL,
    installment_number integer NOT NULL,
    month character varying(40) NOT NULL,
    value numeric(10,2) DEFAULT 0.00 NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    paid_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    transaction_id integer NOT NULL,
    user_id integer NOT NULL,
    CONSTRAINT installment_number_higher_zero CHECK ((installment_number > 0)),
    CONSTRAINT validate_paid_date CHECK ((((paid = false) AND (paid_at IS NULL)) OR ((paid = true) AND (paid_at IS NOT NULL)))),
    CONSTRAINT value_is_positive CHECK ((value >= (0)::numeric))
);


ALTER TABLE public.credit_installments OWNER TO postgres;

--
-- Name: credit_installments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.credit_installments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.credit_installments_id_seq OWNER TO postgres;

--
-- Name: credit_installments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.credit_installments_id_seq OWNED BY public.credit_installments.id;


--
-- Name: receipt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.receipt (
    id integer NOT NULL,
    url_attachment character varying(200) NOT NULL,
    receipt_date timestamp without time zone NOT NULL,
    amount_transactions integer DEFAULT 0 NOT NULL,
    total_price_transactions numeric(10,2) DEFAULT 0.00 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer NOT NULL,
    category_id integer,
    CONSTRAINT amount_transactions_is_positive CHECK ((amount_transactions >= 0)),
    CONSTRAINT total_price_transactions_is_positive CHECK ((total_price_transactions >= (0)::numeric))
);


ALTER TABLE public.receipt OWNER TO postgres;

--
-- Name: receipt_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.receipt_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.receipt_id_seq OWNER TO postgres;

--
-- Name: receipt_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.receipt_id_seq OWNED BY public.receipt.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    description character varying(20) NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    amount integer NOT NULL,
    total_price numeric(10,2) DEFAULT 0.00 NOT NULL,
    transaction_type public.transaction_types NOT NULL,
    total_installments integer DEFAULT 0 NOT NULL,
    installments_paid boolean DEFAULT false NOT NULL,
    has_receipt boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    receipt_id integer,
    category_id integer,
    user_id integer NOT NULL,
    CONSTRAINT amount_is_positive CHECK ((amount >= 0)),
    CONSTRAINT total_price_is_positive CHECK ((total_price >= (0)::numeric)),
    CONSTRAINT unit_price_is_positive CHECK ((unit_price >= (0)::numeric)),
    CONSTRAINT validate_credit_amount CHECK (((transaction_type <> 'credit'::public.transaction_types) OR ((transaction_type = 'credit'::public.transaction_types) AND (amount = 1)))),
    CONSTRAINT validate_income_amount CHECK (((transaction_type <> 'income'::public.transaction_types) OR ((transaction_type = 'income'::public.transaction_types) AND (amount = 1)))),
    CONSTRAINT validate_receipt_id CHECK ((((has_receipt = true) AND (receipt_id IS NOT NULL)) OR ((has_receipt = false) AND (receipt_id IS NULL)))),
    CONSTRAINT validate_total_installments CHECK (((((transaction_type = 'debit'::public.transaction_types) OR (transaction_type = 'income'::public.transaction_types)) AND (total_installments = 0)) OR ((transaction_type = 'credit'::public.transaction_types) AND (total_installments > 0))))
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_id_seq OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(40) NOT NULL,
    password character varying(40) NOT NULL,
    user_role public.user_roles DEFAULT 'user'::public.user_roles NOT NULL,
    created_by public.created_types DEFAULT 'default'::public.created_types NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_login_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reset_token character varying(300)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cash_flow id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_flow ALTER COLUMN id SET DEFAULT nextval('public.cash_flow_id_seq'::regclass);


--
-- Name: category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- Name: credit_installments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_installments ALTER COLUMN id SET DEFAULT nextval('public.credit_installments_id_seq'::regclass);


--
-- Name: receipt id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipt ALTER COLUMN id SET DEFAULT nextval('public.receipt_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: cash_flow cash_flow_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_flow
    ADD CONSTRAINT cash_flow_pkey PRIMARY KEY (id);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: credit_installments credit_installments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_installments
    ADD CONSTRAINT credit_installments_pkey PRIMARY KEY (id);


--
-- Name: users email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT email_unique UNIQUE (email);


--
-- Name: receipt receipt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: transactions amount_transactions_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER amount_transactions_trigger AFTER INSERT OR DELETE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.get_amount_transactions();


--
-- Name: transactions calculate_total_price_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER calculate_total_price_trigger BEFORE INSERT OR UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.calculate_total_price();


--
-- Name: credit_installments check_status_installments_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_status_installments_trigger AFTER UPDATE ON public.credit_installments FOR EACH ROW EXECUTE FUNCTION public.check_status_installments();


--
-- Name: users create_cash_flow_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER create_cash_flow_trigger AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION public.create_cash_flow();


--
-- Name: transactions create_credit_installments_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER create_credit_installments_trigger AFTER INSERT ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.create_credit_installments();


--
-- Name: transactions disable_update_credit_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER disable_update_credit_trigger BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.disable_update_credit();


--
-- Name: transactions get_balance_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER get_balance_trigger AFTER INSERT OR DELETE OR UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.get_balance();


--
-- Name: transactions get_total_credit_expenses_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER get_total_credit_expenses_trigger AFTER INSERT OR DELETE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.get_total_credit_expenses();


--
-- Name: transactions get_total_expenses_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER get_total_expenses_trigger AFTER INSERT OR DELETE OR UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.get_total_expenses();


--
-- Name: transactions total_price_receipt_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER total_price_receipt_trigger AFTER INSERT OR DELETE OR UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.get_total_price_receipt();


--
-- Name: cash_flow update_at_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_at_trigger BEFORE UPDATE ON public.cash_flow FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: category update_at_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_at_trigger BEFORE UPDATE ON public.category FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: credit_installments update_at_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_at_trigger BEFORE UPDATE ON public.credit_installments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: receipt update_at_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_at_trigger BEFORE UPDATE ON public.receipt FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: transactions update_at_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_at_trigger BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: cash_flow cash_flow_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cash_flow
    ADD CONSTRAINT cash_flow_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: category category_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: credit_installments credit_installments_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_installments
    ADD CONSTRAINT credit_installments_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(id) ON DELETE CASCADE;


--
-- Name: credit_installments credit_installments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_installments
    ADD CONSTRAINT credit_installments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: receipt receipt_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON DELETE SET NULL;


--
-- Name: receipt receipt_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receipt
    ADD CONSTRAINT receipt_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON DELETE SET NULL;


--
-- Name: transactions transactions_receipt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_receipt_id_fkey FOREIGN KEY (receipt_id) REFERENCES public.receipt(id) ON DELETE SET NULL;


--
-- Name: transactions transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

