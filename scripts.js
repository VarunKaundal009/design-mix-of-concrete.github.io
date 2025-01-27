function calculateMixDesign() {
    // Collect user inputs
    const grade = document.getElementById('grade').value;
    const strength = parseFloat(document.getElementById('strength').value);
    const exposure = document.getElementById('exposure').value;
    const slump = parseFloat(document.getElementById('slump').value);
    const coarseSize = parseFloat(document.getElementById('coarseSize').value);
    const fineZone = document.getElementById('fineZone').value;
    const cementSG = parseFloat(document.getElementById('cementSG').value);
    const cementType = document.getElementById('cementType').value;
    const waterSG = parseFloat(document.getElementById('waterSG').value);
    const admixtureSG = parseFloat(document.getElementById('admixtureSG').value) || null;
    const coarseSG = parseFloat(document.getElementById('coarseSG').value);
    const fineSG = parseFloat(document.getElementById('fineSG').value);

    // Standard deviation values from IS 10262-2019 Clause-4.2.1.3 Table 2
    const standardDeviations = {
        'M10': 3.5, 'M15': 3.5, 'M20': 4.0, 'M25': 4.0, 'M30': 5.0, 'M35': 5.0, 'M40': 5.0, 'M45': 5.0, 'M50': 5.0, 'M55': 5.0,
        'M60': 5.0, 'M65': 5.0, 'M70': 5.0, 'M75': 5.0, 'M80': 5.0
    };

    // Determine standard deviation based on concrete grade
    const standardDeviation = standardDeviations[grade];

    // Step-by-step calculation
    const steps = [];

    // Step 1: Calculate the target mean strength
    const targetMeanStrength = strength + 1.65 * standardDeviation;
    steps.push(`Step 1: Calculate the target mean strength\nTarget Mean Strength = ${strength} + 1.65 * ${standardDeviation} = ${targetMeanStrength.toFixed(2)} MPa`);

    // Step 2: Select water-cement ratio based on exposure conditions from IS 456 Table 3
    const waterCementRatios = {
        'mild': 0.55,
        'moderate': 0.50,
        'severe': 0.45,
        'very severe': 0.40,
        'extreme': 0.35
    };
    const waterCementRatio = waterCementRatios[exposure];
    steps.push(`Step 2: Select water-cement ratio based on exposure conditions\nWater-Cement Ratio for ${exposure} exposure = ${waterCementRatio}`);

    // Step 3: Determine water content based on IS 10262-2019 Table 4 and adjust for slump value (base value for 20mm aggregate and 50mm slump)
    const baseWaterContent = 186; // Adjust based on actual table values
    const additionalWaterContent = (slump > 50) ? ((slump - 50) / 25) * 0.03 * baseWaterContent : 0;
    const waterContent = baseWaterContent + additionalWaterContent;
    steps.push(`Step 3: Determine water content and adjust for slump value\nBase Water Content = ${baseWaterContent} kg/m³\nAdditional Water Content for ${slump} mm slump = ${additionalWaterContent.toFixed(2)} kg/m³\nTotal Water Content = ${waterContent.toFixed(2)} kg/m³`);

    // Step 4: Calculate cement content
    const cementContent = waterContent / waterCementRatio;
    steps.push(`Step 4: Calculate cement content\nCement Content = ${waterContent.toFixed(2)} / ${waterCementRatio} = ${cementContent.toFixed(2)} kg/m³`);

    // Step 5: Calculate the volume of all aggregates
    const volumeCement = cementContent / (cementSG * 1000);
    const volumeWater = waterContent / (waterSG * 1000);
    const volumeAdmixture = admixtureSG ? (1 / (admixtureSG * 1000)) : 0;
    const totalAggregateVolume = 1 - (volumeCement + volumeWater + volumeAdmixture);
    steps.push(`Step 5: Calculate the volume of all aggregates\nVolume of Cement = ${cementContent.toFixed(2)} / (${cementSG} * 1000) = ${volumeCement.toFixed(6)} m³\nVolume of Water = ${waterContent.toFixed(2)} / (${waterSG} * 1000) = ${volumeWater.toFixed(6)} m³\nVolume of Admixture = ${volumeAdmixture.toFixed(6)} m³\nTotal Volume of Aggregates = 1 - (${volumeCement.toFixed(6)} + ${volumeWater.toFixed(6)} + ${volumeAdmixture.toFixed(6)}) = ${totalAggregateVolume.toFixed(6)} m³`);

    // Step 6: Calculate volume fraction of coarse aggregate based on IS 10262-2019 Table 5
    const volumeFractionCoarseAggregate = 0.62; // Placeholder, should be based on coarse aggregate size and fine aggregate zone
    const volumeCoarseAggregate = volumeFractionCoarseAggregate * totalAggregateVolume;
    const volumeFineAggregate = totalAggregateVolume - volumeCoarseAggregate;
    steps.push(`Step 6: Calculate volume fraction of coarse and fine aggregates\nVolume Fraction of Coarse Aggregate = ${volumeFractionCoarseAggregate}\nVolume of Coarse Aggregate = ${volumeFractionCoarseAggregate} * ${totalAggregateVolume.toFixed(6)} = ${volumeCoarseAggregate.toFixed(6)} m³\nVolume of Fine Aggregate = ${totalAggregateVolume.toFixed(6)} - ${volumeCoarseAggregate.toFixed(6)} = ${volumeFineAggregate.toFixed(6)} m³`);

    // Step 7: Convert volumes to weights
    const weightCoarseAggregate = volumeCoarseAggregate * coarseSG * 1000;
    const weightFineAggregate = volumeFineAggregate * fineSG * 1000;
    steps.push(`Step 7: Convert volumes to weights\nWeight of Coarse Aggregate = ${volumeCoarseAggregate.toFixed(6)} * ${coarseSG} * 1000 = ${weightCoarseAggregate.toFixed(2)} kg/m³\nWeight of Fine Aggregate = ${volumeFineAggregate.toFixed(6)} * ${fineSG} * 1000 = ${weightFineAggregate.toFixed(2)} kg/m³`);

    // Display results
    let result = `<h2>Mix Design Results</h2>`;
    result += `<p>Cement: ${cementContent.toFixed(2)} kg/m³</p>`;
    result += `<p>Water: ${waterContent.toFixed(2)} kg/m³</p>`;
    result += `<p>Coarse Aggregate: ${weightCoarseAggregate.toFixed(2)} kg/m³</p>`;
    result += `<p>Fine Aggregate: ${weightFineAggregate.toFixed(2)} kg/m³</p>`;

    result += `<h2>Calculation Steps</h2>`;
    steps.forEach(step => {
        result += `<p>${step.replace(/\n/g, "<br>")}</p>`;
    });

    document.getElementById('result').innerHTML = result;
}