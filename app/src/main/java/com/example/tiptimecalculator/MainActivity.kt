package com.example.tiptimecalculator

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.annotation.StringRes
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.wrapContentWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.ImeOptions
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.tiptimecalculator.ui.theme.TipTimeTheme
import java.text.NumberFormat

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        setContent {
            TipTimeTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                ) {
                    TipTimeLayout()
                }
            }
        }
    }
}


@Composable
fun TipTimeLayout() {
    var tipInput = remember { mutableStateOf("") }
    var amountInput = remember { mutableStateOf("") }
    var roundUp = remember { mutableStateOf(false) }
    val amount = amountInput.value.toDoubleOrNull() ?: 0.0
    val tipPercent = tipInput.value.toDoubleOrNull() ?: 0.0
    val tip = calculateTip(amount,tipPercent,roundUp.value)
    Column(
        modifier = Modifier
            .statusBarsPadding()
            .padding(horizontal = 40.dp)
            .safeDrawingPadding(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = stringResource(R.string.calculate_tip),
            modifier = Modifier
                .padding(bottom = 16.dp, top = 40.dp)
                .align(alignment = Alignment.Start)
        )
        EditNumberField(
            label = R.string.bill_amount,
            keyboarOptions = KeyboardOptions.Default.copy(
                keyboardType = KeyboardType.NumberPassword,
                imeAction = ImeAction.Next
            ),
            value = amountInput.value,
            onValueChange = {amountInput.value = it},
            modifier = Modifier.padding(bottom = 32.dp).fillMaxWidth()
        )
        EditNumberField(
            label = R.string.how_was_the_service,
            keyboarOptions = KeyboardOptions.Default.copy(
                keyboardType = KeyboardType.NumberPassword,
                imeAction = ImeAction.Done
            ),
            value = tipInput.value,
            onValueChange = { tipInput.value = it},
            modifier = Modifier.padding(bottom = 32.dp).fillMaxWidth()
        )
        RoundTheTipRow(
            roundUp = roundUp.value,
            onRoundUpdChanged = { roundUp.value = it },
            modifier = Modifier.padding(bottom = 32.dp)
        )
        Text(
            text = stringResource(R.string.tip_amount, tip),
            style = MaterialTheme.typography.displaySmall
        )
        Spacer(modifier = Modifier.height(150.dp))
    }
}

@Composable
fun EditNumberField(
    @StringRes label:Int,
    keyboarOptions: KeyboardOptions,
    value:String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier) {

    TextField(
        value = value,
        onValueChange = onValueChange,
        singleLine = true,
        label = { Text(stringResource(label)) },
        keyboardOptions = keyboarOptions,
        modifier = modifier
    )
}

@Composable
fun RoundTheTipRow(
    roundUp:Boolean,
    onRoundUpdChanged : (Boolean) -> Unit,
    modifier: Modifier = Modifier){
    Row (
        modifier = modifier
            .fillMaxWidth()
            .size(48.dp),
        verticalAlignment = Alignment.CenterVertically
    ){
        Text(text = stringResource(R.string.round_up_tip))
        Switch(
            modifier = modifier
                .fillMaxWidth()
                .wrapContentWidth(Alignment.End),
            checked = roundUp,
            onCheckedChange = onRoundUpdChanged,
        )
    }
}

private fun calculateTip(
    amount: Double,
    tipPercent: Double = 15.0,
    roundUp :Boolean
): String {
    var tip = tipPercent / 100 * amount
    if ( roundUp) {
        tip = kotlin.math.ceil(tip)
    }
    return NumberFormat.getCurrencyInstance().format(tip)
}

@Preview(showBackground = true)
@Composable
fun TipTimeLayoutPreview() {
    TipTimeTheme {
        TipTimeLayout()
    }
}
