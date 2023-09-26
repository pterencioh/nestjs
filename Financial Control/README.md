# Database Structure
![control_financial_db](https://github.com/pterencioh/nestjs/assets/107655462/e9c8d73c-a030-402c-95ae-fab5eedf9d8b)

# Trigger Functions

### Users
<table border="1">
  <tr>
      <th colspan="4">Trigger Functions (users)</th>
  </tr>
  <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Fire</th>
      <th>Events</th>
  </tr>
  <tr>
      <td>create_cash_flow()</td>
      <td>After an user is created, the function will create a record in the cash_flow table for that user.</td>
      <td><b>AFTER<b></td>
      <td><b>INSERT</b></td>
  </tr>
</table>

### Category
<table border="1">
  <tr>
      <th colspan="4">Trigger Functions (category)</th>
  </tr>
  <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Fire</th>
      <th>Events</th>
  </tr>
  <tr>
      <td>set_updated_at()</td>
      <td>Update the 'updated_at' column when an <b>UPDATE</b> occurs.</td>
      <td><b>BEFORE</td>
      <td><b>UPDATE</b></td>
  </tr>
</table>


### Cash Flow
<table border="1">
  <tr>
      <th colspan="4">Trigger Functions (cash_flow)</th>
  </tr>
  <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Fire</th>
      <th>Events</th>
  </tr>
  <tr>
      <td>set_updated_at()</td>
      <td>Update the 'updated_at' column when an <b>UPDATE</b> occurs.</td>
      <td><b>BEFORE</b></td>
      <td><b>UPDATE</b></td>
  </tr>
</table>


### Transactions
<table border="1">
  <tr>
      <th colspan="4">Trigger Functions (transactions)</th>
  </tr>
  <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Fire</th>
      <th>Events</th>
  </tr>
  <tr>
      <td>set_updated_at()</td>
      <td>Update the 'updated_at' column when an <b>UPDATE</b> occurs.</td>
      <td align="center"><b>BEFORE</b></td>
      <td align="center"><b>UPDATE</b></td>
  </tr>
  <tr>
      <td>get_amount_transactions()</td>
      <td>When a record is created or deleted with a related receipt, the function will count how many transactions exist in that receipt and will <b>UPDATE</b> the 'amount_transactions' column of the related receipt.</td>
      <td align="center"><b>AFTER</b></td>
      <td align="center"><b>INSERT</b>   <b>DELETE</b></td>
  </tr>
  <tr>
      <td>calculate_total_price()</td>
      <td>This function is responsible for calculating the value of the 'total_price' column. It checks whether the transaction type is 'Debit,' 'Credit,' or 'Income.'<br>

For 'Debit' and 'Income' types, the total price is calculated as 'unit_price' * 'amount.'

For 'Credit' type, the total price is calculated as 'unit_price' * 'total_installments.</td>
      <td align="center"><b>BEFORE</b></td>
      <td align="center"><b>INSERT</b>   <b>UPDATE</b></td>
  </tr>
  <tr>
      <td>create_credit_installments()</td>
      <td>After a credit transaction is created and the 'installments_paid' column is <b>FALSE</b>, the function will retrieve the value of the 'total_installments' column and create individual installments for that transaction, taking into account the current month.

For example: If the 'Total Installments' is three and today's month is November, the function will insert three records into 'credit_installments' (for November, December, and January).</td>
      <td align="center"><b>AFTER</b></td>
      <td align="center"><b>INSERT</b></td>
  </tr>
  <tr>
      <td>disable_update_credit()</td>
      <td>For records where the transaction type is 'credit,' the function will prevent the <b>UPDATE</b> operation if the user is attempting to update the columns 'unit_price,' 'amount,' 'total_price,' or 'total_installments.'</td>
      <td align="center"><b>BEFORE</b></td>
      <td align="center"><b>UPDATE</b></td>
  </tr>
  <tr>
      <td>get_balance()</td>
      <td>Every time an insert, update, or delete operation that modifies the 'total_price' column occurs, the function will calculate the sum of the values for Total Income transactions, Total Debit transactions, and Total Credit Paid, and then <b>UPDATE</b> the 'balance' column in the user's 'cash_flow' table. The balance is calculated as follows:

  
Balance = Total Income - (Total Debits + Total Credits Paid).</td>
      <td align="center"><b>AFTER</b></td>
      <td align="center"><b>INSERT</b>   <b>UPDATE</b>   <b>DELETE</b></td>
  </tr>
  <tr>
      <td>get_total_credit_expenses()</td>
      <td>After a credit transaction is created or deleted, the function will calculate the sum of all credit transactions that still need to be paid and will update the 'total_credit_expenses' column in the user's 'cash_flow' table.</td>
      <td align="center"><b>AFTER</b></td>
      <td align="center"><b>INSERT</b>   <b>DELETE</b></td>
  </tr>
  <tr>
      <td>get_total_expenses()</td>
      <td>Every time an insert, update, or delete operation that modifies the 'total_price' column occurs, or when a credit transaction is fully paid, the function will calculate the sum of all debit transactions and the credit transactions that have been paid, and update the 'total_expenses' column in the user's cash_flow table.</td>
      <td align="center"><b>AFTER</b></td>
      <td align="center"><b>INSERT</b>   <b>UPDATE</b>   <b>DELETE</b></td>
  </tr>
  <tr>
      <td>total_price_receipt()</td>
      <td>Every time an insert, update, or delete operation occurs, and the record has a related receipt, the function will calculate the sum of the total prices of the transactions associated with that related receipt and update the 'total_price' column in the user's 'receipt' table.</td>
      <td align="center"><b>AFTER</b></td>
      <td align="center"><b>INSERT</b>   <b>UPDATE</b>   <b>DELETE</b></td>
  </tr>
  <tr>
      <td>set_updated_at()</td>
      <td>Update the 'updated_at' column when an <b>UPDATE</b> occurs.</td>
      <td align="center"><b>BEFORE</b></td>
      <td align="center"><b>UPDATE</b></td>
  </tr>
</table>


### Receipt
<table border="1">
  <tr>
      <th colspan="4">Trigger Functions (receipt)</th>
  </tr>
  <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Fire</th>
      <th>Events</th>
  </tr>
  <tr>
      <td>set_updated_at()</td>
      <td>Update the 'updated_at' column when an <b>UPDATE</b> occurs.</td>
      <td><b>BEFORE</b></td>
      <td><b>UPDATE</b></td>
  </tr>
</table>


### Credit Installments
<table border="1">
  <tr>
      <th colspan="4">Trigger Functions (credit_installments)</th>
  </tr>
  <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Fire</th>
      <th>Events</th>
  </tr>
  <tr>
      <td>set_updated_at()</td>
      <td>Update the 'updated_at' column when an <b>UPDATE</b> occurs.</td>
      <td><b>BEFORE</b></td>
      <td><b>UPDATE</b></td>
  </tr>
  <tr>
      <td>check_status_installments()</td>
      <td>After an installment is paid, the function checks whether all installments related to that transaction are also paid. If they are, it will <b>UPDATE</b> the 'installments_paid' column of the transaction to <b>TRUE</b>.</td>
      <td><b>AFTER</b></td>
      <td><b>UPDATE</b></td>
  </tr>
</table>